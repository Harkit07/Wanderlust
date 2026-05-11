const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("error", "Username or email already taken");
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    req.session.userId = newUser._id;
    req.flash("success", "Welcome to Wanderlust!");
    req.session.save((err) => {
      if (err) return next(err);
      res.redirect("/listings");
    });
  } catch (e) {
    console.log("signup error:", e.message);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/login");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/login");
    }

    req.session.userId = user._id;
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    req.flash("success", "Welcome back to Wanderlust!");
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err); // 👈 log it
        return next(err);
      }
      res.redirect(redirectUrl);
    });
  } catch (e) {
    console.log("login error:", e.message);
    next(e);
  }
};

module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/listings");
  });
};
