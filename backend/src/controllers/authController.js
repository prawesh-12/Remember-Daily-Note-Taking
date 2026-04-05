import jwt from "jsonwebtoken";
import { exchangeGoogleCodeForProfile } from "../config/googleAuth.js";

function getJwtSecret() {
    const secret = process.env.JWT_SECRET || process.env.CLIENT_SECRET;

    if (!secret) {
        throw new Error("JWT secret is not configured");
    }

    return secret;
}

export async function googleLogin(req, res) {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
        return res
            .status(400)
            .json({ message: "Google authorization code is required" });
    }

    try {
        const profile = await exchangeGoogleCodeForProfile(code);
        const jwtSecret = getJwtSecret();

        const token = jwt.sign(
            {
                sub: profile.sub,
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
            },
            jwtSecret,
            { expiresIn: "7d" },
        );

        return res.status(200).json({
            token,
            user: {
                id: profile.sub,
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
            },
        });
    } catch (error) {
        console.error("Error in googleLogin controller", error);

        if (
            error.message?.includes("missing") ||
            error.message?.includes("configured")
        ) {
            return res
                .status(500)
                .json({ message: "OAuth server is not configured" });
        }

        return res
            .status(401)
            .json({ message: "Failed to authenticate with Google" });
    }
}
