import { MongoClient } from "mongodb";
import "dotenv/config";

let products = [
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa855",
    },
    id: "1",
    url: "/assets/img/travel-agency-website-tower-of-london-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$399 - $499",
    month: "june",
    season: "summer",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "london",
    rating: "two",
  },
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa856",
    },
    id: "2",
    url: "/assets/img/travel-agency-website-dubai-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$399 - $499",
    month: "november",
    season: "winter",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "dubai",
    rating: "five",
  },
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa857",
    },
    id: "3",
    url: "/assets/img/travel-agency-website-gold-coast-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$699 - $999",
    month: "may",
    season: "spring",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "goldcoast",
    rating: "five",
  },
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa858",
    },
    id: "4",
    url: "/assets/img/travel-agency-website-singapore-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$699 - $999",
    month: "september",
    season: "autumn",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "singapore",
    rating: "four",
  },
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa859",
    },
    id: "5",
    url: "/assets/img/travel-agency-website-toronto-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$499 - $599",
    month: "august",
    season: "autumn",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "toronto",
    rating: "three",
  },
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa85a",
    },
    id: "6",
    url: "/assets/img/travel-agency-website-taj-mahal-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$999 +",
    month: "april",
    season: "spring",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "tajmahal",
    rating: "one",
  },
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa85b",
    },
    id: "7",
    url: "/assets/img/travel-agency-website-spanish-villa-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$599 - $699",
    month: "june",
    season: "summer",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "madrid",
    rating: "two",
  },
  {
    _id: {
      $oid: "65d184c84ae0d8bc04afa85c",
    },
    id: "8",
    url: "/assets/img/travel-agency-website-eiffel-tower-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$499 - $599",
    month: "july",
    season: "summer",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "paris",
    rating: "four",
  },
  {
    _id: {
      $oid: "65d79d3586063a089a9806db",
    },
    id: "9",
    url: "/assets/img/travel-agency-website-rome-image.jpg",
    title: "Lorem ipsum dolor sit amet.",
    price: "$799 - $999",
    month: "July",
    season: "summer",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
    location: "rome",
    rating: "three",
  },
];

// let cartItems = [
//   {
//     _id: {
//       $oid: "65d184c84ae0d8bc04afa855",
//     },
//     id: "1",
//     url: "/assets/img/travel-agency-website-tower-of-london-image.jpg",
//     title: "Lorem ipsum dolor sit amet.",
//     price: "$399 - $499",
//     month: "june",
//     season: "summer",
//     text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
//     location: "london",
//     rating: "two",
//   },
//   {
//     _id: {
//       $oid: "65d184c84ae0d8bc04afa856",
//     },
//     id: "2",
//     url: "/assets/img/travel-agency-website-dubai-image.jpg",
//     title: "Lorem ipsum dolor sit amet.",
//     price: "$399 - $499",
//     month: "november",
//     season: "winter",
//     text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
//     location: "dubai",
//     rating: "five",
//   },
//   {
//     _id: {
//       $oid: "65d184c84ae0d8bc04afa857",
//     },
//     id: "3",
//     url: "/assets/img/travel-agency-website-gold-coast-image.jpg",
//     title: "Lorem ipsum dolor sit amet.",
//     price: "$699 - $999",
//     month: "may",
//     season: "spring",
//     text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim odit dolor sequi voluptatem esse doloribus libero commodi ea debitis.",
//     location: "goldcoast",
//     rating: "five",
//   },
// ];

let cartItems = ["1", "2", "4", "6"];

const withDB = async (operations, res) => {
  try {
    // const client = await MongoClient.connect(
    //   process.env.DB_USER && process.env.DB_PASS
    //     ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqewv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    //     : "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.4"
    // );

    const client = await MongoClient.connect(
      "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.4"
    );
    const db = client.db("TravelAgency");
    await operations(db);
    client.close();
  } catch (err) {
    res.status(500).send({ message: "Database Error", err });
  }
};

function populateCartIds(ids) {
  return ids.map((id) => products.find((product) => product.id === id));
}

const routes = (app) => {
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
      const bestdealitems = await db.collection("bestDeals").find({}).toArray();
      res.status(200).json(bestdealitems);
    }, res);
  });
  //single best deal
  app.get("/api/bestdeal/:itemid", async (req, res) => {
    const { itemid } = req.params;
    await withDB(async (db) => {
      const bestdealitem = await db
        .collection("bestDeals")
        .findOne({ id: itemid });
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
        .collection("holidayPackages")
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
        .collection("holidayPackages")
        .findOne({ id: itemid });

      if (holidaypackageitem) {
        res.status(200).json(holidaypackageitem);
      } else {
        res.status(404).json("could not find holidaypackage");
      }
    }, res);
  });
  //searchform
  app.get("/api/searchform", async (req, res) => {
    await withDB(async (db) => {
      const searchformitems = await db
        .collection("searchForm")
        .find({})
        .toArray();
      res.status(200).json(searchformitems); //use json instead of send
    }, res);
  });
  //searchform
  app.get("/api/languages", async (req, res) => {
    await withDB(async (db) => {
      const languageselectitems = await db
        .collection("languageSelect")
        .find({})
        .toArray();
      res.status(200).json(languageselectitems); //use json instead of send
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

  app.get("/api/cart", (req, res) => {
    const cartResults = populateCartIds(cartItems);
    res.json(cartResults);
  });

  app.post("/api/cart", (req, res) => {
    const productId = req.body.id;
    cartItems.push(productId);
    const cartResults = populateCartIds(cartItems);
    res.json(cartResults);
  });

  app.delete("/api/cart/:productId", (req, res) => {
    const productId = req.params.productId;
    cartItems = cartItems.filter((id) => id !== productId);
    const cartResults = populateCartIds(cartItems);
    res.json(cartResults);
  });
};

export default routes;
