import mongoose from "mongoose";

// const Schema = mongoose.Schema;

export const SearchFormSchema = new mongoose.Schema({
  searchform: [
    { locations: [{ type: String }] },
    { date: [{ type: String }] },
    { month: [{ type: String }] },
    { years: [{ type: String }] },
    { duration: [{ type: String }] },
    { board: [{ type: String }] },
    { star: [{ type: String }] },
    { adults: [{ type: Number }] },
    { children: [{ type: Number }] },
  ],
});
