"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import SearchableSelect from "./SearchableSelect";
import Toast from "./Toast";
import InstrumentalModal from "./InstrumentalModal";

export default function Dashboard() {
    const { data: session } = useSession();
    const [metadata, setMetadata] = useState({ genres: [], eras: [], languages: [] });
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedEra, setSelectedEra] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [playlistUrl, setPlaylistUrl] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [toast, setToast] = useState(null);
    const [showInstrumentalModal, setShowInstrumentalModal] = useState(false);

    useEffect(() => {
        async function fetchMetadata() {
            try {
                const res = await fetch("/api/genres");
                if (res.ok) {
                    const data = await res.json();
                    setMetadata(data);
                }
            } catch (e) {
                console.error("Failed to fetch metadata", e);
            }
        }
        fetchMetadata();
    }, []);

    useEffect(() => {
        const instrumentalGenres = ["Lofi", "Chill", "Ambient", "Classical", "Instrumental", "Jazz", "Electronic", "Techno", "House", "Trance", "Dubstep"];
        const isInstrumental = instrumentalGenres.some(genre => selectedGenre.toLowerCase().includes(genre.toLowerCase()));

        if (selectedGenre && isInstrumental) {
            setShowInstrumentalModal(true);
        }
    }, [selectedGenre]);

    const performSearch = (withFilters = true) => {
        setLoading(true);
        setError(null);
        setPlaylistUrl(null);

        const query = new URLSearchParams({
            genre: selectedGenre || "",
            era: withFilters ? (selectedEra || "") : "",
            language: withFilters ? (selectedLanguage || "") : "",
            offset: 0
        });

        fetch(`/api/recommendations?${query.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRecommendations(data);
                    setOffset(0);
                } else {
                    setRecommendations([]);
                    setError("No tracks found!");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setRecommendations([]);
                setError("Failed to fetch recommendations!");
                setLoading(false);
            });
    };

    const handleSearch = () => {
        if (!selectedLanguage) {
            setToast("🌍 Please select a language to discover amazing music!");
            return;
        }

        setHasSearched(true);
        performSearch(true);
    };

    const regenerate = () => {
        setLoading(true);
        setError(null);
        setToast("🔄 Finding new tracks...");

        const query = new URLSearchParams({
            genre: selectedGenre || "",
            era: selectedEra || "",
            language: selectedLanguage || "",
            offset: offset + 20
        });

        fetch(`/api/recommendations?${query.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRecommendations(data);
                    setOffset(offset + 20);
                } else {
                    setRecommendations([]);
                    setError("No more tracks found!");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch more recommendations!");
                setLoading(false);
            });
    };

    const removeTrack = (trackId) => {
        setRecommendations(prev => prev.filter(t => t.id !== trackId));
        setToast("✕ Track removed");
    };

    const savePlaylist = async () => {
        setSaving(true);
        try {
            const trackUris = recommendations.map(t => t.uri);
            let playlistName = "My Curated Playlist";

            const eraTitles = {
                "2020s": "Modern Hits", "2010s": "2010s Throwbacks", "2000s": "2000s Classics",
                "1990s": "90s Nostalgia", "1980s": "80s Legends", "1970s": "70s Grooves",
                "1960s": "60s Classics", "Oldies": "Golden Oldies"
            };

            const genreSuffixes = {
                "Rock": "Anthems", "Pop": "Hits", "Hip Hop": "Beats", "Jazz": "Sessions",
                "Electronic": "Vibes", "Classical": "Masterpieces", "K-Pop": "Hits",
                "Metal": "Mayhem", "R&B": "Grooves", "Country": "Roads", "Indie": "Gems", "Latin": "Ritmos"
            };

            if (selectedEra && selectedGenre) {
                playlistName = `${selectedEra} ${selectedGenre} ${genreSuffixes[selectedGenre] || "Mix"}`;
            } else if (selectedEra) {
                playlistName = eraTitles[selectedEra] || "Classics";
            } else if (selectedGenre) {
                playlistName = `${selectedGenre} ${genreSuffixes[selectedGenre] || "Essentials"}`;
            } else if (selectedLanguage) {
                playlistName = `${selectedLanguage} Favorites`;
            }

            if (selectedLanguage && !playlistName.includes(selectedLanguage)) {
                playlistName = `${selectedLanguage} ${playlistName}`;
            }

            const descriptionParts = [];
            if (selectedGenre) descriptionParts.push(selectedGenre);
            if (selectedEra) descriptionParts.push(selectedEra);
            if (selectedLanguage) descriptionParts.push(selectedLanguage);

            const playlistDescription = descriptionParts.length > 0
                ? `${descriptionParts.join(" · ")} playlist. Made by Spotify Recommender (built by GuyOnAKeyboard)`
                : "Made by Spotify Recommender (built by GuyOnAKeyboard)";

            const res = await fetch("/api/playlist/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: playlistName, description: playlistDescription, trackUris })
            });

            if (res.ok) {
                const data = await res.json();
                setPlaylistUrl(data.url);
                setToast("🎉 Playlist saved successfully!");
            } else {
                setToast("❌ Failed to save playlist!");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const resetSearch = () => {
        setSelectedGenre("");
        setSelectedEra("");
        setSelectedLanguage("");
        setRecommendations([]);
        setPlaylistUrl(null);
        setError(null);
        setHasSearched(false);
    };

    return (
        <div className="main-container">
            <header className="glass" style={{ width: "100%", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "900px", borderRadius: "1.5rem", marginTop: "2rem" }}>
                <h1>🎵 Spotify Recommender</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span>{session?.user?.name || session?.user?.email}</span>
                    <button onClick={() => signOut()} className="login-button" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>Logout</button>
                </div>
            </header>

            <div style={{ width: "100%", maxWidth: "900px", padding: "2rem" }}>
                <div className="glass" style={{ padding: "2rem", borderRadius: "1.5rem", marginBottom: "2rem" }}>
                    <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>🎸 Find Your Perfect Playlist</h2>
                    <div className="selection-controls">
                        <SearchableSelect value={selectedGenre} onChange={setSelectedGenre} options={["", ...metadata.genres]} placeholder="Any Genre" label="Genre (Optional)" icon="🎵" />
                        <SearchableSelect value={selectedEra} onChange={setSelectedEra} options={["", ...metadata.eras]} placeholder="Any Era" label="Era (Optional)" icon="📅" />
                        <SearchableSelect value={selectedLanguage} onChange={setSelectedLanguage} options={metadata.languages} placeholder="Select Language" label="Language (Required)" icon="🌍" />
                    </div>
                    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                        <button onClick={handleSearch} className="login-button" style={{ padding: "1rem 3rem", fontSize: "1.1rem", opacity: (!selectedLanguage && !loading) ? 0.5 : 1, cursor: (!selectedLanguage && !loading) ? "not-allowed" : "pointer" }} disabled={loading}>
                            {loading ? "Searching..." : "🔍 Search Tracks"}
                        </button>
                    </div>
                </div>

                {hasSearched && (
                    <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') resetSearch(); }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>{[selectedEra, selectedLanguage, selectedGenre].filter(Boolean).join(" ") || "All Music"}</h3>
                                <button className="modal-close" onClick={resetSearch} title="Close">✕</button>
                            </div>

                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                <button onClick={regenerate} className="login-button" style={{ background: "#535353", padding: "0.5rem 1rem", fontSize: "0.9rem" }} disabled={loading || error}>🔄 Regenerate</button>
                                {recommendations.length > 0 && (
                                    <button onClick={savePlaylist} className="login-button" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }} disabled={saving || playlistUrl}>
                                        {saving ? "Saving..." : playlistUrl ? "✓ Saved!" : "💾 Save Playlist"}
                                    </button>
                                )}
                            </div>

                            {playlistUrl && <div className="success-banner">🎉 Playlist Saved! <a href={playlistUrl} target="_blank" rel="noopener noreferrer">Open in Spotify →</a></div>}

                            {loading ? (
                                <div style={{ textAlign: "center", padding: "3rem" }}>
                                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎵</div>
                                    <p style={{ fontSize: "1.2rem" }}>Finding tracks...</p>
                                </div>
                            ) : error ? (
                                <div className="glass" style={{ textAlign: "center", padding: "3rem", borderRadius: "1.5rem" }}>
                                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎵</div>
                                    <h3 style={{ marginBottom: "1rem", color: "#fff" }}>No Tracks Found</h3>
                                    <p style={{ color: "#b3b3b3", marginBottom: "2rem" }}>{error}</p>
                                    <button onClick={resetSearch} className="login-button" style={{ padding: "0.75rem 2rem", background: "#535353" }}>Try Different Criteria</button>
                                </div>
                            ) : recommendations.length === 0 ? (
                                <div className="glass" style={{ textAlign: "center", padding: "3rem", borderRadius: "1.5rem" }}>
                                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎧</div>
                                    <h3 style={{ color: "#b3b3b3" }}>No results yet</h3>
                                </div>
                            ) : (
                                <ul className="track-list" style={{ listStyle: "none", padding: 0 }}>
                                    {recommendations.map((track) => (
                                        <li key={track.id} className="track-item glass">
                                            {track.album.images[0] && <img src={track.album.images[0].url} alt={track.name} className="track-image" />}
                                            <div className="track-info">
                                                <span className="track-name">{track.name}</span>
                                                <span className="track-artist">{track.artists.map((a) => a.name).join(", ")}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="login-button" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }} title="Play in Spotify">▶️ Play</a>
                                                <button onClick={() => removeTrack(track.id)} style={{ background: "transparent", border: "none", color: "#ff5555", cursor: "pointer", fontSize: "1.2rem" }} title="Remove track">✕</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            {showInstrumentalModal && (
                <InstrumentalModal
                    genre={selectedGenre}
                    onSearchWithLanguage={() => {
                        setShowInstrumentalModal(false);
                    }}
                    onSearchInstrumental={() => {
                        setShowInstrumentalModal(false);
                        setHasSearched(true);
                        performSearch(false);
                    }}
                    onClose={() => {
                        setShowInstrumentalModal(false);
                        setSelectedGenre("");
                    }}
                />
            )}
        </div>
    );
}
