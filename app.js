require("dotenv").config();

const express = require("express");
const app = express();
const { MongoStore } = require("connect-mongo");
const ExpressError = require("./utils/ExpressError.js");
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

// ─── Database URL ───────────────────────────────────────────
const dbUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URL ||
      "mongodb://127.0.0.1:27017/wanderlust_test"
    : process.env.ATLASDB_URL;

// ─── View Engine ────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ─── Middleware ─────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ─── Session Configuration ─────────────────────────────────
const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

// Use MongoDB session store in production/development.
// Use the default MemoryStore during Jest tests because
// the tests do not require persistent sessions.
if (process.env.NODE_ENV !== "test") {
  const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
  });

  store.on("error", (err) => {
    console.error("ERROR in MONGO SESSION STORE:", err);
  });

  sessionOptions.store = store;
}

app.use(session(sessionOptions));
app.use(flash());

// ─── User Middleware ────────────────────────────────────────
app.use(async (req, res, next) => {
  try {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    const user = req.session.userId
      ? await User.findById(req.session.userId)
      : null;

    req.user = user;
    res.locals.currUser = user;

    next();
  } catch (err) {
    next(err);
  }
});

// ─── Routes ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings/category", categoryRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ─── CastError Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return next(new ExpressError(404, "Resource not found"));
  }

  next(err);
});

// ─── General Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const { status = 500, message = "Something went wrong" } = err;

  if (status === 404) {
    return res.status(404).render("404");
  }

  res.status(status).render("error", {
    status,
    message,
  });
});

module.exports = app;