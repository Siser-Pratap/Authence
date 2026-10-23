// Disabled during the Next.js migration. Never connect to the legacy database.
export default function signup(_req, res) {
  return res.status(503).json({
    message: "Legacy registration is unavailable during the Next.js migration.",
  });
}
