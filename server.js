import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";
//import rateLimit from "express-rate-limit";
import history from "connect-history-api-fallback";
import "dotenv/config";
// file path
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//port
const PORT = process.env.LOCAL_PORT;
//routes
import routes from "./src/routes/travRoutes.js";

const app = express();

// add helmet
app.use(helmet());

// set up trust proxy
app.set("trust proxy", 1);

// Apply the rate limiting middleware to all requests
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   // store: ... , // Use an external store for consistency across multiple server instances.
// });
// app.use(limiter);

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// history
app.use(history());

routes(app);

app.use(express.static(path.join(__dirname, "/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build"));
});

app.listen(PORT || 8000, () => {
  console.log(`server is listening ${PORT}`);
});
