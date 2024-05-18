import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)

//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

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
    const holidaypackageitems = await db
      .collection("products")
      .find({})
      .toArray();
    res.status(200).json(holidaypackageitems);
  });
  //single holiday package
  app.get("/api/holidaypackage/:itemid", async (req, res) => {
    const { itemid } = req.params;

    const holidaypackageitem = await db
      .collection("products")
      .findOne({ id: itemid });

    if (holidaypackageitem) {
      res.status(200).json(holidaypackageitem);
    } else {
      res.status(404).json("could not find holidaypackage");
    }
  });
  //searchform
  app.get("/api/searchform", async (req, res) => {
    const searchformitems = await db
      .collection("searchForm")
      .find({})
      .toArray();
    res.status(200).json(searchformitems); //use json instead of send
  });
  //language select
  app.get("/api/languages", async (req, res) => {
    const languageselectitems = await db
      .collection("languageItems")
      .find({})
      .toArray();
    res.status(200).json(languageselectitems); //use json instead of send
  });
  // contact page
  app.post("/api/contact", async (req, res) => {
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

  app.get("/api/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });

    console.log(user);
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  // app.get("/api/products/:productId", async (req, res) => {
  //   const productId = req.params.productId;
  //   const product = await db.collection("products").findOne({ id: productId });
  //   res.json(product);
  // });

  app.post("/api/users/:userId/cart", async (req, res) => {
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
  });

  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
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
  });
};

export default routes;
