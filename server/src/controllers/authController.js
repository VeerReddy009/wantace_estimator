import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { username, password } = req.body || {};
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "roofing2026!";

  if (username !== expectedUsername || password !== expectedPassword) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign(
    {
      role: "owner",
      username,
    },
    process.env.JWT_SECRET || "change-me",
    { expiresIn: "12h" }
  );

  res.cookie("owner_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 12 * 60 * 60 * 1000,
  });

  return res.json({ token });
}
