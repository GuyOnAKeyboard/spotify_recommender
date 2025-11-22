import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import spotifyApi from "@/lib/spotify";

export async function GET() {
    const session = await getServerSession(authOptions);

    let genres = [];

    // Try to fetch genres from Spotify API if user is logged in
    if (session?.user?.accessToken) {
        try {
            spotifyApi.setAccessToken(session.user.accessToken);
            const genreData = await spotifyApi.getAvailableGenreSeeds();

            // Convert genre seeds to title case for better display
            genres = genreData.body.genres.map(genre => {
                return genre
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }).sort();

            console.log(`Fetched ${genres.length} genres from Spotify`);
        } catch (error) {
            console.error("Error fetching genres from Spotify:", error);
            // Fall back to hardcoded list if API fails
            genres = [
                "Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical",
                "Electronic", "Indie", "K-Pop", "Metal", "Reggae", "Latin", "Blues",
                "Lofi", "Chill", "Ambient", "House", "Techno", "Trap", "Soul",
                "Funk", "Disco", "Punk", "Alternative", "Folk", "Gospel", "EDM", "Dance"
            ];
        }
    } else {
        // If no session, use hardcoded list
        genres = [
            "Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical",
            "Electronic", "Indie", "K-Pop", "Metal", "Reggae", "Latin", "Blues",
            "Lofi", "Chill", "Ambient", "House", "Techno", "Trap", "Soul",
            "Funk", "Disco", "Punk", "Alternative", "Folk", "Gospel", "EDM", "Dance"
        ];
    }

    const eras = [
        "2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s", "Oldies"
    ];

    const languages = [
        "English", "Spanish", "Korean", "Japanese", "French", "German",
        "Hindi", "Portuguese", "Italian", "Chinese", "Arabic", "Russian",
        "Bengali", "Tamil", "Telugu", "Punjabi", "Marathi", "Turkish"
    ];

    return NextResponse.json({
        genres,
        eras,
        languages
    });
}
