const mongoose = require("mongoose");
const express = require("express");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectFlash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./models/user");
const router = require("./routes/index");
require("dotenv").config();

const app = express();
//Connects Server to Database
mongoose.connect("mongodb://127.0.0.1:27017/brandeis_saa");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to the database!");
});

//Initializes express/website port

app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("public"));
app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Initializes the Flash methods
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use(connectFlash());
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
);
//Initializes sessions, cookies and passport authentication/encryption
app.use(cookieParser("secret_passcode"));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Prepares flashMessages.
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

//Default Routes to Webpages
app.use("/", router);

//Reports if server successfully ran
const server = app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

//Listens to the server for new chat messges
const io = require("socket.io")(server);
require("./controllers/chatController")(io);
