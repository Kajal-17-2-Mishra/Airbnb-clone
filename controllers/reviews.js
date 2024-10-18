const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// create review callback

module.exports.createReview = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log(newReview);
  req.flash("success", "New Review was created!");

  res.redirect(`/listings/${listing._id}`);
};

// destroy review callback

module.exports.destroyReview = async (req, res, next) => {
  let { id } = req.params;
  let { reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review was deleted!");

  res.redirect(`/listings/${id}`);
};
