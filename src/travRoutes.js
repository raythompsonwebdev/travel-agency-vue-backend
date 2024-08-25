import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = `mongodb://127.0.0.1:27017/`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await client.connect();
// Send a ping to confirm a successful connection
await client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");

const db = client.db("travelagency");

async function populateCartIds(ids) {
  return Promise.all(
    ids.map((id) => db.collection("products").findOne({ id }))
  );
}

const routes = (app) => {
  // best deals
  app.get("/api/bestdeals", async (req, res) => {
    try {
      const bestdealitems = await db.collection("products").find({}).toArray();
      res.json(bestdealitems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch best deal data" });
    }
  });
  // single best deal
  app.get("/api/bestdeal/:itemid", async (req, res) => {
    try {
      const { itemid } = req.params;
      const bestdealitem = await db
        .collection("products")
        .findOne({ id: itemid });

      res.status(200).json(bestdealitem);
    } catch (error) {
      res.status(500).json("could not find bestdeal data :" + error);
    }
  });
  // holiday packages
  app.get("/api/holidaypackages", async (req, res) => {
    try {
      const holidaypackageitems = await db
        .collection("products")
        .find({})
        .toArray();
      res.status(200).json(holidaypackageitems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch holiday data" + error });
    }
  });
  // single holiday package.
  app.get("/api/holidaypackage/:itemid", async (req, res) => {
    try {
      const { itemid } = req.params;

      const holidaypackageitem = await db
        .collection("products")
        .findOne({ id: itemid });
      res.json(holidaypackageitem);
    } catch (error) {
      res.status(500).json("could not find holiday data :" + error);
    }
  });
  // searchform.
  app.get("/api/searchform", async (req, res) => {
    // console.log(req);
    //const searchformitems = await db.collection("products").find({}).toArray();
    res.status(200).json({ test: "test" }); //use json instead of send
  });
  // contact page form.
  app.post("/api/contact", async (req, res) => {
    // console.log(req.body);
    // try{
    // const { firstname, lastname, email, phone, message } = req.body;
    // const contacts = await db.collection("contact").insertOne({
    //   firstname: firstname,
    //   lastname: lastname,
    //   email: email,
    //   phone: phone,
    //   message: message,
    // });
    // res.status(200).json(contacts);
    // }catch(error){
    //   res.status(500).json("could not find contact data :" + error);
    // }
  });
  // cart routes.
  app.get("/api/users/:userId/cart", async (req, res) => {
    try {
      const user = await db
        .collection("users")
        .findOne({ id: req.params.userId });

      const populatedCart = await populateCartIds(user.cartItems);
      res.json(populatedCart);
    } catch (error) {
      res.status(500).json("could not find cart data :" + error);
    }
  });

  app.post("/api/users/:userId/cart", async (req, res) => {
    try {
      const userId = req.params.userId;
      const productId = req.body.id;

      await db.collection("users").updateOne(
        { id: userId },
        {
          $addToSet: { cartItems: productId },
        }
      );

      const user = await db
        .collection("users")
        .findOne({ id: req.params.userId });
      const populatedCart = await populateCartIds(user.cartItems);
      res.json(populatedCart);
    } catch (error) {
      res.status(500).json("could not find user cart data :" + error);
    }
  });

  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
    try {
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
      const populatedCart = await populateCartIds(user.cartItems);
      res.json(populatedCart);
    } catch (error) {
      res.status(500).json("could not find cartId data :" + error);
    }
  });
};

export default routes;
