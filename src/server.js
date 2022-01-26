

require('dotenv').config({ path: ".env" });
const PORT = process.env.PORT || 8000;
import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from "path";
import history from "connect-history-api-fallback";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const app = express();
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
      `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.aqewv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      //`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
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

app.use("/images", express.static(path.join(__dirname, "../assets")));

app.get("/api/home", async (req, res) => {
  await withDB(async db => {
    const homepageitems = await db.collection("homePage").find({}).toArray();
    res.status(200).json(homepageitems); //use json instead of send
  }, res);
});

app.get("/api/bestdeals", async (req, res) => {
  await withDB(async db => {
    const bestdealitems = await db
      .collection("bestdealitems")
      .find({})
      .toArray();
    res.status(200).json(bestdealitems);
  }, res);
});

app.get("/api/bestdeals/:bestdealId", async (req, res) => {
  const { bestdealId } = req.params;
  await withDB(async db => {
    const bestdealitem = await db
      .collection("bestdealitems")
      .findOne({ id: bestdealId });
    if (bestdealitem) {
      res.status(200).json(bestdealitem);
    } else {
      res.status(404).json("could not find bestdeal");
    }
  }, res);
});

app.get("/api/holidaypackages", async (req, res) => {
  await withDB(async db => {
    const holidaypackageitems = await db
      .collection("holidaypackageitems")
      .find({})
      .toArray();
    res.status(200).json(holidaypackageitems);
  }, res);
});

app.get("/api/holidaypackages/:holidaypackageId", async (req, res) => {
  const { holidaypackageId } = req.params;
  await withDB(async db => {
    const holidaypackageitem = await db
      .collection("holidaypackageitems")
      .findOne({ id: holidaypackageId });
    if (holidaypackageitem) {
      res.status(200).json(holidaypackageitem);
    } else {
      res.status(404).json("could not find holidaypackage");
    }
  }, res);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`server is listening ${PORT}`);
});
