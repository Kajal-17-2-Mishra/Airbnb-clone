const Listing = require("../models/listing.js");
// const ExpressError = require("../utils/ExpressError.js")

// index route callback
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index", { allListings });
};
// new route callback

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new");
};
// show route callback
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  res.render("./listings/show", { listing });
};

// create route callback

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  // console.log(newListing);
  req.flash("success", "New listing created!");
  res.redirect(`/listings`);
};

// edit form route listing

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("./listings/edit", { listing, originalImageUrl });
};

// Update listing route callback

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing was updated!");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  // console.log("deleted");
  req.flash("success", "Listing was deleted!");
  res.redirect("/listings");
};
