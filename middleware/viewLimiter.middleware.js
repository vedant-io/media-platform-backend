import viewLimiter from "../lib/arcjet.js";

export const arcjetViewLimiter = async (req, res, next) => {
  try {
    const decision = await viewLimiter.protect(req);

    if (decision.isDenied()) {
      return res.status(429).json({
        error: "Too Many Requests",
        reason: decision.reason,
      });
    }

    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
