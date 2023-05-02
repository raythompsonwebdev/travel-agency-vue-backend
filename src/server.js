//const dot = require('dotenv').config({ path: ".env" });
const PORT = process.env.PORT || 8000;
import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

//set up file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import history from "connect-history-api-fallback";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(bodyParser.json());
app.use(
  express.static(path.resolve(__dirname, "../dist"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use(history());
const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect(
      process.env.DB_USER && process.env.DB_PASS
        ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
        : `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    const db = client.db("travelagency");
    await operations(db);
    client.close();
  } catch (err) {
    res.status(500).send({ message: "Database Error", err });
  }
};

app.use("/images", express.static(path.join(__dirname, "./assets")));

//home page
app.get("/api/home", async (req, res) => {
  await withDB(async (db) => {
    const homepageitems = await db.collection("homePage").find({}).toArray();

    res.status(200).json(homepageitems); //use json instead of send
  }, res);
});
//best deals
app.get("/api/bestdeals", async (req, res) => {
  await withDB(async (db) => {
    const bestdealitems = await db
      .collection("bestdealitems")
      .find({})
      .toArray();
    res.status(200).json(bestdealitems);
  }, res);
});
//single best deal
app.get("/api/bestdeal/:itemid", async (req, res) => {
  const { itemid } = req.params;
  await withDB(async (db) => {
    const bestdealitem = await db
      .collection("bestdealitems")
      .findOne({ itemid: itemid });
    if (bestdealitem) {
      res.status(200).json(bestdealitem);
    } else {
      res.status(404).json("could not find bestdeal");
    }
  }, res);
});
//holiday packages
app.get("/api/holidaypackages", async (req, res) => {
  await withDB(async (db) => {
    const holidaypackageitems = await db
      .collection("holidaypackageitems")
      .find({})
      .toArray();
    res.status(200).json(holidaypackageitems);
  }, res);
});
//single holiday package
app.get("/api/holidaypackage/:itemid", async (req, res) => {
  const { itemid } = req.params;
  await withDB(async (db) => {
    const holidaypackageitem = await db
      .collection("holidaypackageitems")
      .findOne({ itemid: itemid });
    if (holidaypackageitem) {
      res.status(200).json(holidaypackageitem);
    } else {
      res.status(404).json("could not find holidaypackage");
    }
  }, res);
});
// contact page
app.post("/api/contact", async (req, res) => {
  console.log(req.body);

  const { firstname, lastname, email, phone, message } = req.body;

  await withDB(async (db) => {
    const contacts = await db.collection("contact").insertOne({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      message: message,
    });

    res.status(200).json(contacts); //use json instead of send
  }, res);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT || 8000, () => {
  console.log(`server is listening ${PORT}`);
});
