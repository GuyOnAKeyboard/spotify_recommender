"use client";

export default function GenreSelector({ genres, selectedGenre, onSelect }) {
    return (
        <div className="genre-grid">
            {genres.map((genre) => (
                <div
                    key={genre}
                    className={`genre-card ${selectedGenre === genre ? "selected" : ""}`}
                    onClick={() => onSelect(genre)}
                >
                    {genre}
                </div>
            ))}
        </div>
    );
}
