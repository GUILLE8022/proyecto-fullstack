const localOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173"
];

const parseOrigins = () => {
  const fromEnv = [];

  if (process.env.FRONTEND_URLS) {
    fromEnv.push(...process.env.FRONTEND_URLS.split(",").map((o) => o.trim()));
  }

  if (process.env.FRONTEND_URL) {
    fromEnv.push(process.env.FRONTEND_URL.trim());
  }

  return [...new Set([...fromEnv, ...localOrigins].filter(Boolean))];
};

const allowedOrigins = parseOrigins();

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) return true;

  // Vercel preview y production (*.vercel.app)
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;

  // Railway previews (opcional)
  if (/^https:\/\/[\w-]+\.up\.railway\.app$/.test(origin)) return true;

  return false;
};

export const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    console.warn(`⚠️ CORS bloqueado para origen: ${origin}`);
    console.warn(`   Orígenes configurados: ${allowedOrigins.join(", ") || "(ninguno)"}`);
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
