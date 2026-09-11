import { env } from "./env.js";

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  bcryptSaltRounds: 10,
};
