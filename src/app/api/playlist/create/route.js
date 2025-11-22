import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import spotifyApi from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, trackUris } = await request.json();

    if (!name || !trackUris || trackUris.length === 0) {
        return NextResponse.json({ error: "Missing name or tracks" }, { status: 400 });
    }

    spotifyApi.setAccessToken(session.user.accessToken);

    try {
        // 1. Get User ID
        const me = await spotifyApi.getMe();
        const userId = me.body.id;

        // 2. Create Playlist
        const playlist = await spotifyApi.createPlaylist(name, {
            description: description,
            public: false // Default to private
        });

        // 3. Add Tracks
        await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

        return NextResponse.json({
            success: true,
            playlistId: playlist.body.id,
            url: playlist.body.external_urls.spotify
        });

    } catch (error) {
        console.error("Error creating playlist:", error);
        return NextResponse.json({
            error: "Failed to create playlist",
            message: error.message,
            body: error.body
        }, { status: 500 });
    }
}
