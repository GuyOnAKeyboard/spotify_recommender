import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import spotifyApi from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const era = searchParams.get("era");
    const language = searchParams.get("language");
    const offset = searchParams.get("offset") || "0";

    spotifyApi.setAccessToken(session.user.accessToken);

    try {
        // Build a track search query with proper filters
        let query = "";

        // Add genre as search term (not using genre: filter as it's unreliable)
        if (genre) {
            // Convert title case back to Spotify format (lowercase with hyphens)
            const genreFormatted = genre.toLowerCase().replace(/\s+/g, '-');
            query += `${genreFormatted} `;
        }

        // Add year filter
        if (era) {
            let yearRange = "";
            if (era.includes("2020s")) yearRange = "2020-2025";
            else if (era.includes("2010s")) yearRange = "2010-2019";
            else if (era.includes("2000s")) yearRange = "2000-2009";
            else if (era.includes("1990s")) yearRange = "1990-1999";
            else if (era.includes("1980s")) yearRange = "1980-1989";
            else if (era.includes("1970s")) yearRange = "1970-1979";
            else if (era.includes("1960s")) yearRange = "1960-1969";
            else if (era.includes("Oldies")) yearRange = "1900-1959";

            if (yearRange) {
                query += `year:${yearRange} `;
            }
        }

        // Add language as a search term (not a filter, since Spotify doesn't have language filter)
        if (language) {
            query += `${language} `;
        }

        // If no criteria, return error
        if (!query.trim()) {
            return NextResponse.json({ error: "At least one criteria required" }, { status: 400 });
        }

        console.log("Searching for tracks with query:", query);

        // Search for tracks with the constructed query
        const actualOffset = parseInt(offset);
        const data = await spotifyApi.searchTracks(query.trim(), {
            limit: 50,
            offset: actualOffset
        });

        let tracks = data.body.tracks.items;

        // Remove duplicates by track ID
        const uniqueTracks = [];
        const seenIds = new Set();

        for (const track of tracks) {
            if (track && track.id && !seenIds.has(track.id)) {
                seenIds.add(track.id);
                uniqueTracks.push(track);
            }
        }

        // Take only 20 tracks
        const finalTracks = uniqueTracks.slice(0, 20);

        console.log(`Returning ${finalTracks.length} unique tracks`);
        return NextResponse.json(finalTracks);

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return NextResponse.json({
            error: "Failed to fetch recommendations",
            message: error.message,
            body: error.body
        }, { status: 500 });
    }
}
