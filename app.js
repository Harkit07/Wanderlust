require("dotenv").config();
const express = require("express");
const app = express();
const MongoStore = require("connect-mongo");
const ExpressError = require("./utils/ExpressError.js");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");

const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const categoryRouter = require("./routes/category.js");

const dbUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URL || "mongodb://localhost:27017/wanderlust_test"
    : process.env.ATLASDB_URL;
const RENDER_URL = process.env.RENDER_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.session.userId
    ? await User.findById(req.session.userId)
    : null;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings/category", categoryRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ─── 404 & Error Handling ──────────────────────────────────
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return next(new ExpressError(404, "Resource not found"));
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { status = 500, message = "Something went wrong" } = err;
  if (status === 404) {
    return res.status(404).render("404");
  }
  res.status(status).render("error", { status, message });
});

if (require.main === module) {
  app.listen(8080, () => console.log("server is listening to port 8080"));
}

module.exports = app;
