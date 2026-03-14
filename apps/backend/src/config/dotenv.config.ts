import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Convierte duraciones en formato string (ej: '7d', '1h', '60s') a segundos
 * @param duration Ejemplo: '7d' (7 días), '1h' (1 hora), '60s' (60 segundos)
 * @returns Duración en segundos
 */
function parseDurationToSeconds(duration: string): number {
  if (!duration) return 3600; // default 1 hora

  const match = duration.match(/^(\d+)([smhd])$/i);
  if (!match) return 3600;

  const [, value, unit] = match;
  const num = parseInt(value, 10);

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return num * (multipliers[unit.toLowerCase()] || 1);
}

export interface IConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  appUrl: string;
  frontendUrl: string;
  corsAllowedOrigins: string[];
  jwtSecret: string;
  jwtExpiresIn: number;
  refreshTokenExpiresIn: number;
  db: {
    url: string;
    port: number;
    host: string;
    username: string;
    password: string;
    name: string;
    schema: string;
    migrateData: boolean;
    logQueries: boolean;
    synchronize: boolean;
    ssl: boolean;
  };
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    fromName: string;
    secure: boolean;
  };
  ai: {
    callbackApiKey: string;
    maxRetries: number;
    retryDelayMs: number;
    serviceUrl: string;
    requestTimeoutMs: number;
    backendPublicUrl: string;
    serviceApiKey: string;
  };
}

/**
 * Valida que las variables requeridas estén presentes
 */
function validateConfig(): void {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const requiredVars = hasDatabaseUrl
    ? []
    : ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Variables de entorno requeridas no definidas: ${missingVars.join(', ')}`,
    );
  }
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (typeof value !== 'string') return defaultValue;
  return value === 'true';
}

function parseCsv(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

// Validar configuración al iniciar (opcional en desarrollo)
if (process.env.NODE_ENV === 'production') {
  validateConfig();
}

const dbLogQueriesEnv = process.env.DB_LOG_QUERIES;
const dbLogQueries =
  typeof dbLogQueriesEnv === 'string'
    ? dbLogQueriesEnv === 'true'
    : process.env.NODE_ENV !== 'production';
const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
const frontendUrl = process.env.FRONTEND_URL || appUrl;
const corsAllowedOrigins = parseCsv(process.env.CORS_ALLOWED_ORIGINS);

export const config: IConfig = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  nodeEnv: (process.env.NODE_ENV as any) || 'development',
  appUrl,
  frontendUrl,
  corsAllowedOrigins:
    corsAllowedOrigins.length > 0
      ? corsAllowedOrigins
      : Array.from(new Set([frontendUrl, appUrl].filter(Boolean))),

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  jwtExpiresIn: parseDurationToSeconds(process.env.JWT_EXPIRES_IN || '1h'),
  refreshTokenExpiresIn: parseDurationToSeconds(
    process.env.REFRESH_TOKEN_EXPIRES_IN || '14d',
  ),

  // Database
  db: {
    url: process.env.DATABASE_URL || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || '',
    schema: process.env.DB_SCHEMA || 'public',
    migrateData: process.env.DB_MIGRATE_DATA === 'true',
    logQueries: dbLogQueries,
    synchronize: parseBoolean(
      process.env.DB_SYNCHRONIZE,
      process.env.NODE_ENV !== 'production',
    ),
    ssl: parseBoolean(process.env.DB_SSL, false),
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Biotasys',
    secure: process.env.EMAIL_SECURE === 'true',
  },

  // AI Integration
  ai: {
    callbackApiKey: process.env.AI_CALLBACK_API_KEY || 'default-callback-key',
    maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3', 10),
    retryDelayMs: parseInt(process.env.AI_RETRY_DELAY_MS || '30000', 10),
    serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    requestTimeoutMs: parseInt(
      process.env.AI_REQUEST_TIMEOUT_MS || '30000',
      10,
    ),
    backendPublicUrl:
      process.env.AI_BACKEND_PUBLIC_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
    serviceApiKey: process.env.AI_SERVICE_API_KEY || '',
  },
};

export default config;
