"use client";

export default function RecommendationList({ tracks }) {
    return (
        <div className="recommendations-container">
            <h2>Recommended Tracks</h2>
            <ul className="track-list">
                {tracks.map((track) => (
                    <li key={track.id} className="track-item">
                        {track.album.images[0] && (
                            <img
                                src={track.album.images[0].url}
                                alt={track.name}
                                className="track-image"
                            />
                        )}
                        <div className="track-info">
                            <span className="track-name">{track.name}</span>
                            <span className="track-artist">
                                {track.artists.map((artist) => artist.name).join(", ")}
                            </span>
                        </div>
                        {track.preview_url ? (
                            <audio controls className="track-preview">
                                <source src={track.preview_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <span className="no-preview">No Preview</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
