import { MongoClient } from "mongodb";
import "dotenv/config";

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

const routes = (app) => {
  //home page
  app.get("/api/home", async (req, res) => {
    await withDB(async (db) => {
      const homepageitems = await db.collection("homePage").find({}).toArray();
      res.status(200).json(homepageitems); //use json instead of send
    }, res);
  });
  //best deals
  app
    .get("/api/bestdeals", async (req, res) => {
      await withDB(async (db) => {
        const bestdealitems = await db
          .collection("bestDeals")
          .find({})
          .toArray();
        res.status(200).json(bestdealitems);
      }, res);
    })
    //single best deal
    .get("/api/bestdeal/:itemid", async (req, res) => {
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
  app
    .get("/api/holidaypackages", async (req, res) => {
      await withDB(async (db) => {
        const holidaypackageitems = await db
          .collection("holidayPackages")
          .find({})
          .toArray();
        res.status(200).json(holidaypackageitems);
      }, res);
    })
    //single holiday package
    .get("/api/holidaypackage/:itemid", async (req, res) => {
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
};

export default routes;
