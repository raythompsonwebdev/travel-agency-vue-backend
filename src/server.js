

require('dotenv').config();

const PORT = process.env.PORT || 8000;
//const PORT = 8000;


import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from "path";
import history from "connect-history-api-fallback";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_DATA = process.env.DB_DATA;

const app = express();
app.use(bodyParser.json());
app.use(
  express.static(path.resolve(__dirname, "../dist"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use(history());

//main connect to mongo db
const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.aqewv.mongodb.net/${DB_DATA}?retryWrites=true&w=majority`,
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

//get static images and files
app.use("/images", express.static(path.join(__dirname, "../assets")));

//get all destinations and featured holiday for home page
app.get("/api/home", async (req, res) => {
  await withDB(async db => {
    const homepageitems = await db.collection("homePage").find({}).toArray();
    res.status(200).json(homepageitems); //use json instead of send
  }, res);
});
//get all best deals
app.get("/api/bestdeals", async (req, res) => {
  await withDB(async db => {
    const bestdealitems = await db
      .collection("bestdealitems")
      .find({})
      .toArray();
    res.status(200).json(bestdealitems);
  }, res);
});
//get single best deal
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
//get all holiday packages
app.get("/api/holidaypackages", async (req, res) => {
  await withDB(async db => {
    const holidaypackageitems = await db
      .collection("holidaypackageitems")
      .find({})
      .toArray();
    res.status(200).json(holidaypackageitems);
  }, res);
});
//get single holiday package
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

// gets all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

//add conditional to determine whether to use localhost or remote server:
app.listen(PORT, () => {
  console.log(`server is listening ${PORT}`);
});
