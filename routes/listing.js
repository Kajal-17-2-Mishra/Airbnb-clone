const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { isLoggedIn } = require("../middleware.js");

const { isOwner, validateListing } = require("../middleware.js");

// INDEX Route-->
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index", { allListings });
  })
);
// NEW Route --->
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new");
});

// SHOW Route -->
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }

    res.render("./listings/show", { listing });
  })
);
// CREATE Route ---->
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(newListing);
    req.flash("success", "New listing created!");
    res.redirect(`/listings`);
  })
);
//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }

    res.render("./listings/edit", { listing });
  })
);

//Update Route
router.put(
  "/:id",

  isLoggedIn,

  isOwner,
  validateListing,
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for to create listing"); // 400--> Bad request
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing was updated!");

    res.redirect(`/listings`);
  })
);

//DELETE Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    // console.log("deleted");
    req.flash("success", "Listing was deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
