const localOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173"
];

export const parseAllowedOrigins = () => {
  const fromEnv = [];

  if (process.env.FRONTEND_URLS) {
    fromEnv.push(...process.env.FRONTEND_URLS.split(",").map((o) => o.trim()));
  }

  if (process.env.FRONTEND_URL) {
    fromEnv.push(process.env.FRONTEND_URL.trim());
  }

  return [...new Set([...fromEnv, ...localOrigins].filter(Boolean))];
};

export const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const allowedOrigins = parseAllowedOrigins();
  if (allowedOrigins.includes(origin)) return true;

  // Vercel: production y previews
  if (/^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) return true;

  return false;
};

export const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    console.warn(`⚠️ CORS bloqueado: ${origin}`);
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

/** Middleware manual — garantiza headers en preflight OPTIONS */
export const corsPreflight = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
};
