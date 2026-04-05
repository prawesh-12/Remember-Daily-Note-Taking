import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    envDir: path.resolve(__dirname, ".."),
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (!id.includes("node_modules")) {
                        return;
                    }

                    const modulePath = id.split("node_modules/")[1];
                    if (!modulePath) {
                        return "vendor";
                    }

                    const pathParts = modulePath.split("/");
                    const packageName = pathParts[0].startsWith("@")
                        ? `${pathParts[0]}/${pathParts[1]}`
                        : pathParts[0];

                    return `vendor-${packageName.replace("@", "").replace("/", "-")}`;
                },
            },
        },
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
            "Cross-Origin-Embedder-Policy": "unsafe-none",
        },
    },
    preview: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
            "Cross-Origin-Embedder-Policy": "unsafe-none",
        },
    },
});
