

//const dot = require('dotenv').config({ path: ".env" });
const PORT = process.env.PORT || 8000;
import express from "express";
import bodyParser from "body-parser";
import {MongoClient} from "mongodb";
import path from "path";
import {fileURLToPath} from 'url';


//set up file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import history from "connect-history-api-fallback";

const app = express();
app.use(bodyParser.json());
app.use(
  express.static(path.resolve(__dirname, "../build"), {
    maxAge: "1y",
    etag: false,
  })
);
app.use(history());
const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect(
      process.env.DB_USER && process.env.DB_PASS ?
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`:`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
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
  await withDB(async db => {
    const homepageitems = await db.collection("homePage").find({}).toArray();
    
    
    res.status(200).json(homepageitems); //use json instead of send
  }, res);
});
//best Deals
app.get("/api/bestdeals", async (req, res) => {
  await withDB(async db => {
    const bestdealitems = await db
      .collection("bestdealitems")
      .find({})
      .toArray();
    res.status(200).json(bestdealitems);
  }, res);
});

app.get("/api/bestdeal/:itemid", async (req, res) => {
  const { itemid } = req.params;
  await withDB(async db => {
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
  await withDB(async db => {
    const holidaypackageitems = await db
      .collection("holidaypackageitems")
      .find({})
      .toArray();
    res.status(200).json(holidaypackageitems);
  }, res);
});

app.get("/api/holidaypackage/:itemid", async (req, res) => {
  const { itemid } = req.params;
  await withDB(async db => {
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

// //get users cart
// app.get('/api/users/:userId/cart', async (req, res) => {
//   const { userId } = req.params;
//   const client = await MongoClient.connect(
//     process.env.DB_USER && process.env.DB_PASS ?
//       `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`:`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//   );
//   const db = client.db(process.env.MONGO_DBNAME || 'travelagency');  
//   const user = await db.collection('users').findOne({ id: userId });
//   if (!user) return res.status(404).json('Could not find user!');
//   const products = await db.collection('cart').find({}).toArray();
//   const cartItemIds = user.cartItems;
//   const cartItems = cartItemIds.map(id =>
//     products.find(product => product.id === id));
//   res.status(200).json(cartItems);
//   client.close();
// });
// // add to users cart
// app.post('/api/users/:userId/cart', async (req, res) => {
//   const { userId } = req.params;
//   //get id of product to add to cart
//   const { productId } = req.body;
//   const client = await MongoClient.connect(
//     process.env.DB_USER && process.env.DB_PASS ?
//       `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`:`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//   );
//     const db = client.db(process.env.MONGO_DBNAME || 'travelagency');
//   await db.collection('users').updateOne({ id: userId }, {
//     $addToSet: { cartItems: productId },
//   });
//   const user = await db.collection('users').findOne({ id: userId });
//   const products = await db.collection('cart').find({}).toArray();
//   const cartItemIds = user.cartItems;
//   const cartItems = cartItemIds.map(id =>
//     products.find(product => product.id === id));
//   res.status(200).json(cartItems);
//   client.close();
// });
// //delet item from cart
// app.delete('/api/users/:userId/cart/:holidaypackageId', async (req, res) => {
//   const { userId, productId } = req.params;
//   const client = await MongoClient.connect(
//     process.env.DB_USER && process.env.DB_PASS ?
//       `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`:`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//   );
//     const db = client.db(process.env.MONGO_DBNAME || 'travelagency');

//   await db.collection('users').updateOne({ id: userId }, {
//     $pull: { cartItems: productId },
//   });
//   const user = await db.collection('users').findOne({ id: userId });
//   const products = await db.collection('cart').find({}).toArray();
//   const cartItemIds = user.cartItems;
//   const cartItems = cartItemIds.map(id =>
//     products.find(product => product.id === id));

//   res.status(200).json(cartItems);
//   client.close();
// });

// app.delete('/api/users/:userId/cart/:bestdealId', async (req, res) => {
//   const { userId, productId } = req.params;
//   const client = await MongoClient.connect(
//     process.env.DB_USER && process.env.DB_PASS ?
//       `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`:`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//   );
//     const db = client.db(process.env.MONGO_DBNAME || 'travelagency');

//   await db.collection('users').updateOne({ id: userId }, {
//     $pull: { cartItems: productId },
//   });
//   const user = await db.collection('users').findOne({ id: userId });
//   const products = await db.collection('cart').find({}).toArray();
//   const cartItemIds = user.cartItems;
//   const cartItems = cartItemIds.map(id =>
//     products.find(product => product.id === id));

//   res.status(200).json(cartItems);
//   client.close();
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen( PORT || 8000, () => {
  console.log(`server is listening ${PORT}`);
});
