import { MongoClient } from "mongodb";
import "dotenv/config";

const url =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.4";
const client = new MongoClient(url);
await client.connect();
const db = client.db("TravelAgency");

async function populateCartIds(ids) {
  return Promise.all(
    ids.map((id) => db.collection("products").findOne({ id }))
  );
}

const routes = (app) => {
  //home page
  app.get("/api/home", async (req, res) => {
    const homepageitems = await db.collection("homePage").find({}).toArray();
    res.status(200).json(homepageitems); //use json instead of send
  });
  //best deals
  app.get("/api/bestdeals", async (req, res) => {
    const bestdealitems = await db.collection("bestDeals").find({}).toArray();
    res.status(200).json(bestdealitems);
  });
  //single best deal
  app.get("/api/bestdeal/:itemid", async (req, res) => {
    const db = client.db("TravelAgency");
    const { itemid } = req.params;

    const bestdealitem = await db
      .collection("bestDeals")
      .findOne({ id: itemid });
    if (bestdealitem) {
      res.status(200).json(bestdealitem);
    } else {
      res.status(404).json("could not find bestdeal");
    }
  });
  //holiday packages
  app.get("/api/holidaypackages", async (req, res) => {
    const db = client.db("TravelAgency");

    const holidaypackageitems = await db
      .collection("holidayPackages")
      .find({})
      .toArray();
    res.status(200).json(holidaypackageitems);
  });
  //single holiday package
  app.get("/api/holidaypackage/:itemid", async (req, res) => {
    const db = client.db("TravelAgency");
    const { itemid } = req.params;

    const holidaypackageitem = await db
      .collection("holidayPackages")
      .findOne({ id: itemid });

    if (holidaypackageitem) {
      res.status(200).json(holidaypackageitem);
    } else {
      res.status(404).json("could not find holidaypackage");
    }
  });
  //searchform
  app.get("/api/searchform", async (req, res) => {
    const db = client.db("TravelAgency");

    const searchformitems = await db
      .collection("searchForm")
      .find({})
      .toArray();
    res.status(200).json(searchformitems); //use json instead of send
  });
  //language select
  app.get("/api/languages", async (req, res) => {
    const db = client.db("TravelAgency");

    const languageselectitems = await db
      .collection("languageSelect")
      .find({})
      .toArray();
    res.status(200).json(languageselectitems); //use json instead of send
  });
  // contact page
  app.post("/api/contact", async (req, res) => {
    const db = client.db("TravelAgency");
    console.log(req.body);

    const { firstname, lastname, email, phone, message } = req.body;

    const contacts = await db.collection("contact").insertOne({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      message: message,
    });

    res.status(200).json(contacts); //use json instead of send
  });
  // user cart
  app.get("/api/users/:userId/cart", async (req, res) => {
    const db = client.db("TravelAgency");
    const user = await db
      .collection("users")
      .findOne({ userId: req.params.userId });
    const cartResults = await populateCartIds(user.cartItems);
    res.status(200).json(cartResults);
  });
  //add to cart
  app.post("/api/users/:userId/cart", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;
    await db
      .collection("users")
      .updateOne({ id: userId }, { $addToSet: { cartItems: productId } });
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const cartResults = populateCartIds(user.cartItems);
    res.json(cartResults);
  });
  // remove from cart
  app.delete("/api//users/:userId/cart/:productId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection("users").updateOne(
      { id: userId },
      {
        $pull: { cartItems: productId },
      }
    );

    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const cartResults = await populateCartIds(user.cartItems);
    res.json(cartResults);
  });
};

export default routes;
