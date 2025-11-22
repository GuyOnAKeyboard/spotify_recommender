"use client";

export default function InstrumentalWarning({ genre, onKeepFilter, onRemoveFilter, onClose }) {
    return (
        <div className="toast" style={{
            padding: "1.5rem 2rem",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center"
        }}>
            <span style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                🎹 <strong>{genre}</strong> tracks are often instrumental.
            </span>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    onClick={onRemoveFilter}
                    className="login-button"
                    style={{
                        padding: "0.6rem 1.2rem",
                        fontSize: "0.9rem",
                        background: "#1db954"
                    }}
                >
                    🎹 Search Instrumental Only
                </button>
                <button
                    onClick={onKeepFilter}
                    className="login-button"
                    style={{
                        padding: "0.6rem 1.2rem",
                        fontSize: "0.9rem",
                        background: "#535353"
                    }}
                >
                    🎤 Keep Language Filter
                </button>
            </div>
            <button
                onClick={onClose}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem"
                }}
            >
                ✕ Close
            </button>
        </div>
    );
}
