"use client";

export default function InstrumentalModal({ genre, onSearchWithLanguage, onSearchInstrumental, onClose }) {
    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') onClose(); }}>
            <div className="modal-content" style={{ maxWidth: "500px" }}>
                <div className="modal-header">
                    <h3 style={{ margin: 0, fontSize: "1.5rem" }}>🎹 {genre} Search Options</h3>
                    <button className="modal-close" onClick={onClose} title="Close">✕</button>
                </div>

                <p style={{ color: "#b3b3b3", marginBottom: "2rem", textAlign: "center" }}>
                    {genre} tracks are often instrumental. How would you like to search?
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <button
                        onClick={onSearchInstrumental}
                        className="login-button"
                        style={{
                            padding: "1rem 1.5rem",
                            fontSize: "1rem",
                            background: "#1db954",
                            width: "100%"
                        }}
                    >
                        🎹 Search Instrumental Only
                        <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.25rem" }}>
                            Find {genre} tracks without language/era filters
                        </div>
                    </button>

                    <button
                        onClick={onSearchWithLanguage}
                        className="login-button"
                        style={{
                            padding: "1rem 1.5rem",
                            fontSize: "1rem",
                            background: "#535353",
                            width: "100%"
                        }}
                    >
                        🎤 Search with Language Filter
                        <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.25rem" }}>
                            Find {genre} tracks with vocals in selected language
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
