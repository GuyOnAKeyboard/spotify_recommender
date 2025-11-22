"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    label,
    icon,
    topOptions = []
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = searchTerm
        ? options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
        : (topOptions.length > 0 ? topOptions : options);

    const displayValue = value || placeholder;

    return (
        <div className="control-group" ref={dropdownRef}>
            {label && <label className="control-label">{icon} {label}</label>}

            <div className="searchable-select">
                <button
                    type="button"
                    className="select-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={value ? "" : "placeholder"}>{displayValue}</span>
                    <span className="arrow">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                    <div className="select-dropdown">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                className="search-input"
                            />
                        </div>

                        <div className="options-list">
                            {filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    className={`option-item ${value === option ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    {option}
                                    {value === option && <span className="check-mark">✓</span>}
                                </div>
                            ))}

                            {filteredOptions.length === 0 && (
                                <div className="no-results">No results found</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
