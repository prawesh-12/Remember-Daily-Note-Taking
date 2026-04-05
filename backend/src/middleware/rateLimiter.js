import ratelimit, { isRateLimiterReady } from "../config/upstash.js";

const shouldFailOpen = process.env.RATE_LIMIT_FAIL_OPEN !== "false";

const getRateLimitIdentifier = (req) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    const proxyIp = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor?.split(",")[0]?.trim();

    const ip = proxyIp || req.ip || req.socket?.remoteAddress || "unknown";

    return `ip:${ip}`;
};

const rateLimiter = async (req, res, next) => {
    if (!isRateLimiterReady || !ratelimit) {
        return next();
    }

    try {
        const identifier = getRateLimitIdentifier(req);
        const { success } = await ratelimit.limit(identifier);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later",
            });
        }

        next();
    } catch (error) {
        console.error("Rate limit error", error);

        if (shouldFailOpen) {
            return next();
        }

        next(error);
    }
};

export default rateLimiter;
