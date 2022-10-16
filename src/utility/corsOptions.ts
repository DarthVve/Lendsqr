export default {
  origin: process.env.APP_URL,
  methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: [
    "X-Powered-By",
    "Access-Control-Allow-Origin",
    "Vary",
    "Access-Control-Allow-Credentials",
    "Set-Cookie",
    "Content-Type",
    "Content-Length",
    "ETag",
    "Date",
    "Connection",
    "Keep-Alive"
  ],
  allowedHeaders: [
    "Cookie",
    "Cache-Control",
    "Content-Type",
    "Content-Length",
    "Host",
    "User-Agent",
    "Accept",
    "Accept-Encoding",
    "X-Requested-With",
    "Connection",
    "Authorization"
  ]
}
