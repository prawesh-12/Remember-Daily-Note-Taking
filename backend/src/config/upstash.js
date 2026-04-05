import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isRateLimitEnabled = process.env.RATE_LIMIT_ENABLED !== "false";
const hasUpstashCredentials = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

const parsedMaxRequests = Number.parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "10",
    10,
);
const maxRequests =
    Number.isFinite(parsedMaxRequests) && parsedMaxRequests > 0
        ? parsedMaxRequests
        : 10;
const rateLimitWindow = process.env.RATE_LIMIT_WINDOW || "60 s";

let ratelimit = null;

if (isRateLimitEnabled && hasUpstashCredentials) {
    try {
        ratelimit = new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(maxRequests, rateLimitWindow),
        });
    } catch (error) {
        console.error("Failed to initialize Upstash rate limiter", error);
        ratelimit = null;
    }
} else if (isRateLimitEnabled) {
    console.warn(
        "Rate limiter disabled because Upstash credentials are missing.",
    );
} else {
    console.warn("Rate limiter disabled via RATE_LIMIT_ENABLED=false.");
}

export const isRateLimiterReady = Boolean(ratelimit);

export default ratelimit;
