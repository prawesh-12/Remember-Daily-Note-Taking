import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import authenticateUser from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

// Needed on Render/proxies so req.ip and x-forwarded-for resolve correctly.
app.set("trust proxy", 1);

const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...configuredOrigins,
]);

// middleware
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow CLI tools and server-to-server calls with no Origin header.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`Not allowed by CORS: ${origin}`));
        },
    }),
);

app.use((_, res, next) => {
    // Allow Google OAuth popup to communicate and close cleanly.
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
});
app.use(express.json()); // this middleware will parse JSON bodies: req.body

if (isProduction) {
    app.use(express.static(frontendDistPath));
}

app.use(rateLimiter);

// simple custom middleware
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//   next();
// });

app.use("/api/auth", authRoutes);
app.use("/api/notes", authenticateUser, notesRoutes);

if (isProduction) {
    app.get("*", (req, res) => {
        res.sendFile(frontendIndexPath);
    });
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});
