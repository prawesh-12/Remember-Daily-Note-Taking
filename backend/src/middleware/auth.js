import jwt from "jsonwebtoken";

export default function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authorization token is missing" });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || process.env.CLIENT_SECRET;

    if (!jwtSecret) {
        return res
            .status(500)
            .json({ message: "Server auth configuration error" });
    }

    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = payload;
        return next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid or expired authorization token" });
    }
}
