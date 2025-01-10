const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review=require("../Models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../Models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

// Review Route
// Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete  review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;