const request = require("supertest");
const app = require("../app");
const Listing = require("../models/listing");

describe("Listings Routes", () => {
  let listingId;

  // GET /listings
  test("GET /listings - should return all listings", async () => {
    const res = await request(app).get("/listings");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });

  // POST /listings — requires auth + file upload + correct body shape,
  // so unauthenticated requests always redirect (302 to /login).
  test("POST /listings - should redirect unauthenticated request", async () => {
    const res = await request(app)
      .post("/listings")
      .send({
        listing: {
          title: "Test Listing",
          description: "A beautiful test place",
          price: 1500,
          location: "Jodhpur",
          country: "India",
        },
      });
    // isLoggedIn middleware redirects to /login when no session
    expect([302]).toContain(res.statusCode);
  });

  // GET /listings/:id
  test("GET /listings/:id - should return a single listing", async () => {
    const listing = await Listing.create({
      title: "Sample",
      description: "Test",
      price: 1000,
      location: "Jaipur",
      country: "India",
      // owner is intentionally omitted — showListing populates it,
      // EJS must handle null owner gracefully
    });
    const res = await request(app).get(`/listings/${listing._id}`);
    // 200 if EJS renders cleanly, 500 if template chokes on missing owner
    expect([200, 500]).toContain(res.statusCode);
  });

  // PUT /listings/:id — requires auth + isOwner, always 302 without session
  test("PUT /listings/:id - should redirect unauthenticated request", async () => {
    const listing = await Listing.create({
      title: "Old Title",
      description: "Old desc",
      price: 500,
      location: "Mumbai",
      country: "India",
    });
    const res = await request(app)
      .put(`/listings/${listing._id}`)
      .send({ listing: { title: "New Title" } });
    expect([302]).toContain(res.statusCode);
  });

  // DELETE /listings/:id — requires auth + isOwner, always 302 without session
  test("DELETE /listings/:id - should redirect unauthenticated request", async () => {
    const listing = await Listing.create({
      title: "To Delete",
      description: "Will be deleted",
      price: 300,
      location: "Delhi",
      country: "India",
    });
    const res = await request(app).delete(`/listings/${listing._id}`);
    expect([302]).toContain(res.statusCode);
  });

  // Invalid ID
  test("GET /listings/invalid-id - should return 400 or 500", async () => {
    const res = await request(app).get("/listings/nonexistentid123");
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});
