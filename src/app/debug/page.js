import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import spotifyApi from "@/lib/spotify";

export default async function DebugPage() {
    const session = await getServerSession(authOptions);

    // 1. Spotify Library Test
    let spotifyStatus = "Not attempted";
    let spotifyError = null;
    let genres = null;

    if (session?.user?.accessToken) {
        spotifyApi.setAccessToken(session.user.accessToken);
        try {
            const data = await spotifyApi.getAvailableGenreSeeds();
            genres = data.body.genres;
            spotifyStatus = "Success (Library)";
        } catch (e) {
            spotifyStatus = "Failed (Library)";
            spotifyError = JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
        }
    }

    // 2. Direct Fetch Test
    let directFetchStatus = "Not attempted";
    let directFetchError = null;
    if (session?.user?.accessToken) {
        try {
            const res = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            });
            if (res.ok) {
                directFetchStatus = "Success (Direct Fetch)";
            } else {
                directFetchStatus = `Failed (Direct Fetch): ${res.status} ${res.statusText}`;
                const text = await res.text();
                directFetchError = text;
            }
        } catch (e) {
            directFetchStatus = "Failed (Direct Fetch Exception)";
            directFetchError = e.message;
        }
    }

    // 3. Profile Test
    let profileStatus = "Not attempted";
    let profileError = null;
    if (session?.user?.accessToken) {
        try {
            const res = await fetch("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            });
            if (res.ok) {
                profileStatus = "Success (Profile)";
            } else {
                profileStatus = `Failed (Profile): ${res.status} ${res.statusText}`;
                const text = await res.text();
                profileError = text;
            }
        } catch (e) {
            profileStatus = "Failed (Profile Exception)";
            profileError = e.message;
        }
    }

    return (
        <div style={{ padding: '2rem', background: '#121212', color: '#fff', fontFamily: 'monospace', minHeight: '100vh' }}>
            <h1 style={{ color: '#1db954' }}>Debug Dashboard</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2>1. Environment Variables</h2>
                <div style={{ padding: '1rem', background: '#282828', borderRadius: '8px' }}>
                    <p>SPOTIFY_CLIENT_ID: {process.env.SPOTIFY_CLIENT_ID ? "✅ Loaded" : "❌ MISSING"}</p>
                    <p>SPOTIFY_CLIENT_SECRET: {process.env.SPOTIFY_CLIENT_SECRET ? "✅ Loaded" : "❌ MISSING"}</p>
                    <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL}</p>
                </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>2. Session Data</h2>
                <div style={{ padding: '1rem', background: '#282828', borderRadius: '8px', overflowX: 'auto' }}>
                    {session ? (
                        <pre>{JSON.stringify(session, null, 2)}</pre>
                    ) : (
                        <p>❌ No Session Found (Try logging in first)</p>
                    )}
                </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>3. Spotify API Test (Server-Side)</h2>
                <div style={{ padding: '1rem', background: '#282828', borderRadius: '8px' }}>
                    <p>Status: <strong>{spotifyStatus}</strong></p>
                    {spotifyError && (
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ color: '#ff5555' }}>Error Details:</p>
                            <pre style={{ color: '#ffb8b8', whiteSpace: 'pre-wrap' }}>{spotifyError}</pre>
                        </div>
                    )}
                    {genres && (
                        <p>✅ Successfully fetched {genres.length} genres</p>
                    )}
                </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>4. Direct Fetch Test</h2>
                <div style={{ padding: '1rem', background: '#282828', borderRadius: '8px' }}>
                    <p>Status: <strong>{directFetchStatus}</strong></p>
                    {directFetchError && (
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ color: '#ff5555' }}>Error Details:</p>
                            <pre style={{ color: '#ffb8b8', whiteSpace: 'pre-wrap' }}>{directFetchError}</pre>
                        </div>
                    )}
                </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>5. Profile Test (/v1/me)</h2>
                <div style={{ padding: '1rem', background: '#282828', borderRadius: '8px' }}>
                    <p>Status: <strong>{profileStatus}</strong></p>
                    {profileError && (
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ color: '#ff5555' }}>Error Details:</p>
                            <pre style={{ color: '#ffb8b8', whiteSpace: 'pre-wrap' }}>{profileError}</pre>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
