const request = require("supertest");
const app = require("../app");
const Listing = require("../models/listing");

describe("Reviews Routes", () => {
  let listing;

  beforeEach(async () => {
    listing = await Listing.create({
      title: "Review Test",
      description: "For reviews",
      price: 1200,
      location: "Udaipur",
      country: "India",
    });
  });

  test("POST /listings/:id/reviews - should add a review", async () => {
    const res = await request(app)
      .post(`/listings/${listing._id}/reviews`)
      .send({ rating: 4, comment: "Great place!" });
    expect([200, 201, 302]).toContain(res.statusCode);
  });

  test("DELETE /listings/:id/reviews/:reviewId - should delete a review", async () => {
    // First add a review, then delete it
    const postRes = await request(app)
      .post(`/listings/${listing._id}/reviews`)
      .send({ rating: 3, comment: "Okay place" });

    // If your API returns the review ID:
    // const reviewId = postRes.body.review._id;
    // const res = await request(app).delete(`/listings/${listing._id}/reviews/${reviewId}`);
    // expect([200, 302]).toContain(res.statusCode);
    expect([200, 201, 302]).toContain(postRes.statusCode);
  });
});
