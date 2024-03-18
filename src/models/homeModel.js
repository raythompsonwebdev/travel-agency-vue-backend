import mongoose from "mongoose";

// const Schema = mongoose.Schema;

export const HomeSchema = new mongoose.Schema({
  destinationitems: [
    {
      id: { type: String },
      city: { type: String },
      country: { type: String },
      hotels: { type: String },
      url: { type: String },
    },
  ],
  featuredholidayitems: [
    {
      id: { type: String },
      url: { type: String },
      text: { type: String },
      price: { type: String },
    },
  ],
});
