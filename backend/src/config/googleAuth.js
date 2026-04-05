import { OAuth2Client } from "google-auth-library";

function getGoogleOAuthConfig() {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    const clientSecret =
        process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || "postmessage";

    if (!clientId || !clientSecret) {
        throw new Error(
            "Google OAuth environment variables are missing on the server",
        );
    }

    return { clientId, clientSecret, redirectUri };
}

export async function exchangeGoogleCodeForProfile(code) {
    const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

    const { tokens } = await oauth2Client.getToken({
        code,
        redirect_uri: redirectUri,
    });

    if (!tokens?.id_token) {
        throw new Error("Google did not return an ID token");
    }

    const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload?.email) {
        throw new Error("Google account payload is incomplete");
    }

    return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email,
        picture: payload.picture || "",
    };
}
