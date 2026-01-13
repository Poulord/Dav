// api/track.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Use POST (updated)" });
  }

  try {
    // Vercel suele parsear JSON si el request viene con Content-Type: application/json
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const ua = req.headers["user-agent"] || "unknown";
    const ref = req.headers["referer"] || "unknown";

    // IP: puede venir aquí; ojo privacidad. Yo NO la guardo, solo dejo const si quieres verla.
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";

    const event = {
      ts: new Date().toISOString(),
      // si quieres VER IP para el “log del profe”, déjala.
      // si no, bórrala.
      ip,
      ua,
      ref,
      ...body,
    };

    // Esto es clave: aparecerá en "Function Logs" de Vercel
    console.log("[telemetry]", JSON.stringify(event));

    // 204 = recibido, sin contenido
    return res.status(204).end();
  } catch (err) {
    console.error("track error:", err);
    return res.status(400).json({ ok: false, error: "Bad JSON" });
  }
}
