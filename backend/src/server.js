import "./config/loadRootEnv.js";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import authenticateUser from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

app.set("trust proxy", 1);

const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
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

            // In production, same-origin requests (frontend served by this
            // server) should always be allowed.
            if (allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            // Log the blocked origin for debugging, but don't crash the server.
            console.warn(`CORS blocked origin: ${origin}`);
            return callback(new Error(`Not allowed by CORS: ${origin}`));
        },
        credentials: true,
    }),
);

app.use((_, res, next) => {
    // Allow Google OAuth popup to communicate and close cleanly.
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
});
app.use(express.json()); // this middleware will parse JSON bodies: req.body

if (!isProduction) {
    app.get("/", (_, res) => {
        res.status(200).json({
            status: "ok",
            message:
                "Backend API is running. Open the frontend at http://localhost:5173",
        });
    });

    app.get("/api/health", (_, res) => {
        res.status(200).json({ status: "ok" });
    });
}

if (isProduction) {
    if (!fs.existsSync(frontendDistPath)) {
        console.error(
            `[production] Frontend dist missing at ${frontendDistPath}. Run the root "npm run build" (builds frontend) before start.`,
        );
    } else if (!fs.existsSync(frontendIndexPath)) {
        console.error(
            `[production] index.html missing at ${frontendIndexPath}.`,
        );
    }
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
    app.get("*", (req, res, next) => {
        // If express.static did not find the file, do not send index.html for real
        // asset URLs (browser would treat HTML as CSS/JS and show MIME errors).
        if (req.path.startsWith("/assets/")) {
            return res.status(404).type("text/plain").send("Not found");
        }
        res.sendFile(frontendIndexPath, (err) => {
            if (err) {
                next(err);
            }
        });
    });
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});
