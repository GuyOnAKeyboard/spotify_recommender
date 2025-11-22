"use client";

import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Spotify Recommender</h1>
                <p className="login-subtitle">Discover new music based on your favorite genres.</p>
                <button
                    className="login-button"
                    onClick={() => signIn("spotify", { callbackUrl: "/" })}
                >
                    Login with Spotify
                </button>
            </div>
        </div>
    );
}
