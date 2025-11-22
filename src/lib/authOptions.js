// authOptions.js (or .ts)

import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "@/lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      error: null,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],

  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Runs on sign-in and on every subsequent JWT check
    async jwt({ token, account }) {
      // Initial login
      if (account) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // ms
        };
      }

      // Return token if access token is still valid
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Otherwise refresh
      return await refreshAccessToken(token);
    },

    // Expose the token to the client and server session
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      session.error = token.error ?? null;
      return session;
    },
  },
};
