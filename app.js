const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const { log } = require("console");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

// connect to mongoDB
main()
  .then(() => {
    console.log("connected to DB.");
  })
  .catch((err) => console.log(err));

// connect to mongoDB
async function main() {
  const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
// INDEX Route-->
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index", { allListings });
  })
);
// NEW Route --->
app.get("/listings/new", (req, res) => {
  res.render("./listings/new");
});

// SHOW Route -->
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      next(new ExpressError(404, "Listing not found"));
    }
    res.render("./listings/show", { listing });
  })
);
// CREATE Route ---->
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
  })
);
//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for to create listing"); // 400--> Bad request
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect(`/listings/${id}`);
  })
);

//DELETE Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    console.log("deleted");
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found."));
});

// Error-Handling middlewares
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("app is listening on port 8080.");
});
