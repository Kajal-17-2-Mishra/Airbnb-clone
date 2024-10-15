const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/users.js");
const postRoutes = require("./routes/posts.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysupersecretestring",
  saveUninitialized: true,
  resave: false,
};
app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  req.flash("success", "user registered successfully!");
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  res.locals.msg = req.flash("success");
  res.render("page.ejs", { name: req.session.name });
});
// app.get("/test", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`you requested ${req.session.count} times`);
// });

// app.use(cookieParser("secret"));

// app.use("/", userRoutes);
// app.use("/posts", postRoutes);

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("name", "kajal", { signed: true });
//   res.send("cookie has been set");
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("names", "uday");
//   res.send("cookie has been set");
// });

// app.get("/verify", (req, res) => {
//   console.log(req.signedCookies);
//   console.log(req.cookies);

//   res.send(
//     `verified ... the name is:${req.signedCookies.name} and age is: ${req.cookies.age}`
//   );
// });

// app.get("/", (req, res) => {
//   console.log(req.cookies);
//   let { name = "Anonymous", age } = req.cookies;

//   res.send(`Hello I'm ${name} and I am ${age}`);
// });
app.listen(3000, () => {
  console.log("listening on port 3000");
});
