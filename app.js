const express = require("express");
const morgan = require("morgan");
const pug = require("pug");
const path = require("path");

const app = express();
const viewRouter = require("./routes/viewRouter");
const stateRouter = require("./routes/stateRouter");
const userRouter = require("./routes/userRouter");

const errorHandler = require("./Controllers/errorController");

const unhandledRouteHandler = (req, res, next) => {
  return res.status(404).json({
    status: "success",
    data: {
      message: `There is no such route!`,
    },
  });
};

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
// CONFIGURING TEMPLATING ENGINE
app.set("view engine", "pug");
app.set("views", path.join(`${__dirname}`, "Views"));

// ROUTING

app.use("/api/v1/users/", userRouter);
app.use("/api/v1/states/", stateRouter);
app.use("/", viewRouter);
app.all("*", unhandledRouteHandler);

app.use(errorHandler);
module.exports = app;
