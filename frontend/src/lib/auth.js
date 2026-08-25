import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aura-luxe-secret-key-102938";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}
