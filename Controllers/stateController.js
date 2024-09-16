const State = require("./../Models/stateModel");
const User = require("./../Models/userModel");

const lodash = require("lodash");
const CatchAsync = require("./../Utilities/catchAsync");
const AppError = require("./../Utilities/AppError");

const formatDate = function (str) {
  let dateArr = `${str}`.split("/");
  dateArr.forEach(function (value, index) {
    dateArr[index] = +value;
  });

  let formattedDate;
  if (dateArr.length == 3) {
    formattedDate = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
  }
  if (dateArr.length == 2) {
    formattedDate = new Date(dateArr[1], dateArr[0] - 1);
  }
  return formattedDate;
};
const trimState = function (state) {
  const singleValueFields = [
    "name",
    "capital",
    "slogan",
    "geopoliticalZone",
    "timeZone",
    "postalCode",
  ];
  const multiValueFields = [
    "localGovernmentAreas",
    "topFiveCities",
    "ethnicities",
  ];

  singleValueFields.forEach(function (field) {
    state[field] = state[field].trim();
  });

  multiValueFields.forEach(function (field) {
    state[field].forEach(function (value, index) {
      state[field][index] = value.trim();
    });
  });
  return state;
};

const capitalizeState = function (state) {
  const fields = [
    "name",
    "capital",
    "geopoliticalZone",
    "slogan",
    "ethnicities",
    "website",
    "localGovernmentAreas",
    "tertiaryInstitutions",
    "topFiveCities",
  ];

  fields.forEach(function (field) {
    if (
      field === "localGovernmentAreas" ||
      field === "ethnicities" ||
      field === "topFiveCities"
    ) {
      state[field].forEach(function (val, index) {
        if (val.split(" ").length > 1) {
          let arr = val.split(" ");
          arr[0] = lodash.capitalize(arr[0]);
          arr[1] = lodash.capitalize(arr[1]);
          state[field][index] = arr.join(" ");
        } else if (val.split("-").length > 1) {
          let arr = val.split("-");
          arr.forEach(function (v, i) {
            arr[i] = lodash.capitalize(v);
          });
          state[field][index] = arr.join("-");
        } else {
          state[field][index] = lodash.capitalize(val);
        }
      });
    }
    if (field === "name" || field === "capital") {
      state[field] = state[field].trim();
      let arr = state[field].split(" ");
      let arr2 = state[field].split("-");
      if (arr2.length > 1) {
        arr2[0] = lodash.capitalize(arr2[0]);
        arr2[1] = lodash.capitalize(arr2[1]);
        state[field] = arr2.join("-");
      } else if (arr.length > 1) {
        arr.forEach(function (value, index) {
          arr[index] = lodash.capitalize(value);
        });
        state[field] = arr.join(" ");
      } else state[field] = lodash.capitalize(state[field]);
    }

    if (field === "tertiaryInstitutions") {
      const keys = Object.keys(state[field]);
      keys.forEach(function (key) {
        state[field][key].forEach(function (institution, index) {
          institution.name = institution.name.trim();
          if (institution.name.split(" ").length > 1) {
            let stringArr = institution.name.split(" ");
            stringArr.forEach(function (value, index) {
              if (value.split("-").length > 1) {
                let arr = value.split("-");
                arr[0] = lodash.capitalize(arr[0]);
                arr[1] = lodash.capitalize(arr[1]);
                stringArr[index] = arr.join("-");
              } else stringArr[index] = lodash.capitalize(value);
            });
            institution.name = stringArr.join(" ");
          }
          institution.founded = formatDate(institution.founded);
        });
      });
    }

    if (field === "geopoliticalZone" || field === "slogan") {
      state[field] = state[field].split(" ");
      state[field].forEach(function (f, index) {
        state[field][index] = state[field][index].trim();
        if (f.length >= 3) state[field][index] = lodash.capitalize(f);
      });
      state[field] = state[field].join(" ");
    }
  });
  return state;
};

exports.createState = CatchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError(`Request body cannot be empty!`));
  }
  req.body = trimState(req.body);
  req.body = capitalizeState(req.body);
  req.body.createdOn = formatDate(req.body.createdOn);
  req.body.website = `https://${req.body.name.toLowerCase()}state.gov.ng/`;
  let position = `Governor of ${req.body.name} State`;
  if (req.body.name.toLowerCase() === "abuja") position = "Minister of FCT";
  const governor = await User.findOne({ position }).select("_id");
  if (!governor) return next(new AppError(`There is no such state!`, 400));
  req.body.governor = governor._id;

  const createdState = await State.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      state: createdState,
    },
  });
});

exports.getAllStates = CatchAsync(async (req, res, next) => {
  const states = await State.find();
  res.status(200).json({
    status: "success",
    data: {
      states,
    },
  });
});

exports.getState = CatchAsync(async (req, res, next) => {
  let state;
  if (req.params.state) {
    if (req.params.state.split(" ").length > 1) {
      let arr = req.params.state.split(" ");
      arr.forEach(function (word, index) {
        arr[index] = lodash.capitalize(word);
      });
      req.params.state = arr.join(" ");
    } else {
      req.params.state = lodash.capitalize(req.params.state);
    }

    state = await State.findOne({ name: req.params.state });
  }
  if (req.body.state) {
    req.body.state = lodash.capitalize(req.body.state);
    state = await State.findOne({ name: req.body.state });
  }

  if (!state) return next(new AppError(`There is no state with such a name!`));
  res.status(200).json({
    status: "success",
    data: {
      state,
    },
  });
});

exports.updateState = CatchAsync(async (req, res, next) => {
  let state;
  if (req.params.state)
    state = await State.findOneAndUpdate(
      { name: lodash.capitalize(req.params.state) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  if (req.body.state)
    state = await State.findOne(
      { name: lodash.capitalize(req.body.state) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

  res.status(200).json({
    status: "success",
    data: {
      state,
    },
  });
});

exports.deleteState = CatchAsync(async (req, res, next) => {
  if (req.params.state.split(" ").length > 1) {
    let arr = req.params.state.split(" ");
    arr.forEach(function (word, index) {
      arr[index] = lodash.capitalize(word);
    });
    req.params.state = arr.join(" ");
  } else {
    req.params.state = lodash.capitalize(req.params.state);
  }
  const state = await State.findOneAndDelete({
    name: req.params.state,
  });

  if (!state) return next(new AppError(`There is no state with such a name!`));

  res.status(200).json({
    status: "success",
    data: {
      message: "State deleted successfully!",
    },
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
  const state = await State.findOne({ name: statesArr[index] });
  res.status(200).json({
    status: "success",
    data: {
      state,
    },
  });
});

exports.checkPending = CatchAsync(async (req, res, next) => {
  //1. Query the DB for all the states and select only the name field
  const states = await State.find().select("name");
  let names = [];
  //2. Loop the states array and save the name field value of each state in an array. The  names  array would store all the states that we already have in ur database
  states.forEach(function (state) {
    names.push(state.name);
  });
  //3. Now create an array that contains all the states and loop it.

  const statesArr = [
    "Abia",
    "Abuja",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];
  let pending = [];
  statesArr.forEach(function (state) {
    //4. Check if the names array contains each element of the statesArr and push any state that isn't contained into a pending array
    if (!names.includes(state)) pending.push(state);
  });
  switch (pending.length) {
    case 10:
      return res.status(200).json({
        status: "success",
        message: `You have only 10 states left to be uploaded to the database!`,
        data: {
          states: pending,
        },
      });
      break;
    case 3:
      return res.status(200).json({
        status: `Success`,
        message: `Three states : ${pending[0]},${pending[1]} and ${pending[2]} left to be uploaded!`,
      });
      break;
    case 2:
      return res.status(200).json({
        status: `Success`,
        message: `Only two states : ${pending[0]} and ${pending[1]} left to be uploaded!`,
      });
      break;
    case 1:
      return res.status(200).json({
        status: `Success`,
        message: `Only ${pending[0]} state is left to be uploaded!`,
      });
      break;
    case 0:
      return res.status(200).json({
        status: `success`,
        message: `All states have been uploaded to the Database!`,
      });
      break;
    default:
      return res.status(200).json({
        status: "success",
        message: `The states below are yet to be uploaded to the database!`,
        number: pending.length,
        data: {
          states: pending,
        },
      });
  }
});
