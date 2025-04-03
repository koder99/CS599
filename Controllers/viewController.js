const State = require("./../Models/stateModel");
const lodash = require("lodash");
const CatchAsync = require("./../Utilities/catchAsync");
const AppError = require("../Utilities/AppError");
const pug = require("pug");

exports.home = (req, res, next) => {
  res.status(200).render("home", {
    title: `Regionify | Home`,
    heading: `Home`,
  });
};

exports.documentation = (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;
  res.status(200).render("docs", {
    title: `Regionify | Documentation`,
    heading: "Documentation",
    url,
  });
};

exports.getState = CatchAsync(async (req, res, next) => {
  let state;
  let arr = [];
  req.params.state.split(" ").forEach(function (el) {
    arr.push(lodash.capitalize(el));
  });
  req.params.state = arr.join(" ");
  state = await State.findOne({
    name: req.params.state,
  });
  if (!state) {
    return next(
      new AppError(`There is no such state! Please check and try again!`, 404)
    );
  }
  res.status(200).render("state", {
    state,
    baseUrl,
    title: `Regionify | ${state.name} State`,
    heading: `${state.name.toUpperCase()}`,
  });
});

exports.getRandomState = CatchAsync(async (req, res, next) => {
  const statesArr = [
    "Kaduna",
    "Adamawa",
    "Abia",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Kogi",
    "Kwara",
    "Kebbi",
    "Niger",
    "Nasarawa",
    "Enugu",
    "Jigawa",
    "Kano",
    "Borno",
    "Cross River",
    "Delta",
    "Lagos",
    "Adamawa",
    "Yobe",
    "Plateau",
    "Sokoto",
    "Taraba",
    "Zamfara",
  ];
  const index = Math.trunc(Math.random() * 36);
  req.params.state = statesArr[index];
});
