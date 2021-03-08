import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from "path";
import history from "connect-history-api-fallback";
// const dotenv = require("dotenv");
// dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(
  express.static(path.resolve(__dirname, "../dist"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use(history());

//get static images and files
app.use("/images", express.static(path.join(__dirname, "../assets")));

//get all destinations and featured holiday for home page
app.get("/api/home", async (req, res) => {
  const client = await MongoClient.connect(
    USER && PASS
      ? `mongodb+srv://${USER}:${PASS}@cluster0.aqewv.mongodb.net/${NAME}?retryWrites=true&w=majority`
      : "mongodb://localhost:27017",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: `${process.env.LOCALHOST_USER}`,
      password: `${process.env.LOCALHOST_PASS}`,
    }
  );

  const db = client.db(`${process.env.NAME}` || "travelagency");
  const homepageitems = await db.collection("homePage").find({}).toArray();
  res.status(200).json(homepageitems);
  client.close();
});
//get all best deals
app.get("/api/bestdeals", async (req, res) => {
  const client = await MongoClient.connect(
    process.env.USER && process.env.PASS
      ? `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.aqewv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`
      : "mongodb://localhost:27017",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: `${process.env.LOCALHOST_USER}`,
      password: `${process.env.LOCALHOST_PASS}`,
    }
  );
  const db = client.db(`${process.env.NAME}` || "travelagency");
  const bestdealitem = await db.collection("bestdealitems").find({}).toArray();
  res.status(200).json(bestdealitem);
  client.close();
});
//get single best deal
app.get("/api/bestdeals/:bestdealId", async (req, res) => {
  const { bestdealId } = req.params;
  const client = await MongoClient.connect(
    process.env.USER && process.env.PASS
      ? `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.aqewv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`
      : "mongodb://localhost:27017",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: `${process.env.LOCALHOST_USER}`,
      password: `${process.env.LOCALHOST_PASS}`,
    }
  );
  const db = client.db(`${process.env.NAME}` || "travelagency");

  const bestdealitem = await db
    .collection("bestdealitems")
    .findOne({ id: bestdealId });
  if (bestdealitem) {
    res.status(200).json(bestdealitem);
  } else {
    res.status(404).json("could not find bestdeal");
  }
  client.close;
});
//get all holiday packages
app.get("/api/holidaypackages", async (req, res) => {
  const client = await MongoClient.connect(
    process.env.USER && process.env.PASS
      ? `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.aqewv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`
      : "mongodb://localhost:27017",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: `${process.env.LOCALHOST_USER}`,
      password: `${process.env.LOCALHOST_PASS}`,
    }
  );
  const db = client.db(`${process.env.NAME}` || "travelagency");
  const holidaypackageitems = await db
    .collection("holidaypackageitems")
    .find({})
    .toArray();
  res.status(200).json(holidaypackageitems);
  client.close();
});
//get single holiday package
app.get("/api/holidaypackages/:holidaypackageId", async (req, res) => {
  const { holidaypackageId } = req.params;
  const client = await MongoClient.connect(
    process.env.USER && process.env.PASS
      ? `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.aqewv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`
      : "mongodb://localhost:27017",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: `${process.env.LOCALHOST_USER}`,
      password: `${process.env.LOCALHOST_PASS}`,
    }
  );
  const db = client.db(`${process.env.NAME}` || "travelagency");
  const holidaypackageitem = await db
    .collection("holidaypackageitems")
    .findOne({ id: holidaypackageId });
  if (holidaypackageitem) {
    res.status(200).json(holidaypackageitem);
  } else {
    res.status(404).json("could not find holidaypackage");
  }

  client.close;
});

// gets all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

//add conditional to determine whether to use localhost or remote server:
app.listen(PORT || 8000, () => {
  console.log(`server is listening ${process.env.PORT}`);
});
