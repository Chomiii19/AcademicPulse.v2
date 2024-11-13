import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again after an hour!",
});

const userLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again after an hour!",
});

const validateIdLimiter = rateLimit({
  max: 1,
  windowMs: 1000,
  message: "Too many request from this IP, please try again!",
});

export { limiter, userLimiter, validateIdLimiter };
