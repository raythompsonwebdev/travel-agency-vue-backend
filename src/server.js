// import dotenv from "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import history from "connect-history-api-fallback";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import routes from "./travRoutes.js";

// Apply the rate limiting middleware to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

const app = express();
app.use(express.json());

app.use(limiter);

app.set("trust proxy", 1);

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000/", //(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

routes(app);
// history
app.use(history());

// add helmet
app.use(helmet());

app.use(express.static(path.join(__dirname, "/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build"));
});

app.listen(8000, () => {
  console.log("server is listening on PORT: 8000");
});
