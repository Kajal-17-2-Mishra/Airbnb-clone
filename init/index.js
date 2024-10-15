const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main()
  .then(() => {
    console.log("connected to DB.");
  })
  .catch((err) => console.log(err));

async function main() {
  const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => {
    return { ...obj, owner: "670625dddccc217c37396359" };
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};
initDB();
