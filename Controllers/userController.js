const lodash = require("lodash");
const slug = require("slug");
const sharp = require("sharp");
const User = require("./../Models/userModel");
const AppError = require("./../Utilities/AppError");
const CatchAsync = require("./../Utilities/catchAsync");

const computeAge = function (dateOfBirth) {
  const currentDate = Date.now();
  const age = Math.trunc((currentDate - dateOfBirth.getTime()) / 31556952000);
  return age;
};

const formatPosition = (position) => {
  const positionArr = position.split(" ");
  let posStringArr = [];
  positionArr.forEach(function (word, i) {
    if (word.length >= 3 && word.toLowerCase() != "fct")
      posStringArr[i] = lodash.capitalize(word);
    if (word.toLowerCase() == "fct") posStringArr[i] = word.toUpperCase();
    if (word.length < 3) posStringArr[i] = word.toLowerCase();
  });
  return posStringArr.join(" ");
};

const capitalizeFields = function (obj, ...fields) {
  fields.forEach(function (field) {
    if (obj[field]) {
      obj[field] = obj[field].trim();
      obj[field] = lodash.capitalize(obj[field]);
    }
  });
};

exports.createUser = CatchAsync(async (req, res, next) => {
  capitalizeFields(req.body, "firstName", "lastName", "middleName", "gender");
  req.body.position = formatPosition(req.body.position);
  const position = req.body.position;
  const check = await User.findOne({ position });
  if (check) {
    let rank = check.position.split(" ")[0];
    errorMessage =
      rank === "Minister"
        ? `We have just a single Minster of FCT`
        : `There can only be one governor for each state!`;
    return next(new AppError(errorMessage, 400));
  }
  ["dateOfBirth", "dateSwornIn"].forEach(function (key) {
    let arr = req.body[key].split("/");
    req.body[key] = new Date(arr[2], +arr[1] - 1, arr[0]);
  });

  const user = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = CatchAsync(async (req, res, next) => {
  let user;
  capitalizeFields(req.body, "firstName", "lastName", "middleName", "gender");
  if (req.body.dateOfBirth) {
    const arr = req.body.dateOfBirth.split("/");
    req.body.dateOfBirth = new Date(arr[2], +arr[1] - 1, arr[0]);
    req.body.age = computeAge(req.body.dateOfBirth);
  }

  if (req.params.id) {
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  if (req.body.position) {
    req.body.position = formatPosition(req.body.position);
    const position = req.body.position;
    user = await User.findOneAndUpdate({ position }, req.body, {
      new: true,
      runValidators: true,
    });
  }

  if (req.params.slug) {
    const slug = req.params.slug;
    user = await User.findOneAndUpdate({ slug }, req.body, {
      new: true,
      runValidators: true,
    });
  }

  if (!user) {
    let errorMessage = "";
    if (req.params.id) errorMessage = `There is no user with that id!`;
    if (req.params.slug || req.body.position)
      errorMessage = `There is no such user!`;
    return next(new AppError(errorMessage, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = CatchAsync(async (req, res, next) => {
  let user;
  if (req.params.id) user = await User.findByIdAndDelete(req.params.id);

  if (req.body.position)
    user = await User.findOneAndDelete({
      position: formatPosition(req.body.position),
    });

  if (req.params.slug) {
    const slug = req.params.slug;
    user = await User.findOneAndDelete({ slug });
  }

  if (!user) {
    let errorMessage = "";
    if (req.params.id) errorMessage = `There is no user with that id!`;
    if (req.params.slug || req.body.position)
      errorMessage = `There is no such user!`;
    return next(new AppError(errorMessage, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      message: `User deleted successfully!`,
    },
  });
});

exports.getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    number: users.length + 1,
    data: {
      users,
    },
  });
});

exports.getUser = CatchAsync(async (req, res, next) => {
  let user;
  console.log(req.params);
  if (req.params.id) user = await User.findOne({ _id: req.params.id });
  else if (req.body.position)
    user = await User.findOne({ position: formatPosition(req.body.position) });
  else if (req.params.slug)
    user = await User.findOne({ slug: req.params.slug });

  if (!user) {
    let errorMessage;
    if (req.params.id) errorMessage = `There is no user with such an id`;
    else errorMessage = `There is no such user`;
    return next(new AppError(errorMessage, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.slugify = CatchAsync(async (req, res, next) => {
  // let _identities = [];
  // const users = await User.find();
  // users.forEach(async function (user) {
  //   _identities.push(user._id);
  // });
  // _identities.forEach(async function (_id) {
  //     const user = await User.findById(_id);
  //     await User.findByIdAndUpdate(user._id, {
  //       slug: slug(user.position, {
  //         lower: true
  //       })
  //     })
  //   })
  // });
  const users = await User.find();
  users.forEach(async function (user) {
    if (!user.slug) {
      user.slug = slug(user.position, {
        lower: true,
      });
      await user.save({ validateBeforeSave: false });
    }
  });

  const slugs = await User.find().select("slug");
  res.status(200).json({
    status: "success",
    message: `Slug applied successfully!`,
    data: {
      slugs,
    },
  });
});

exports.checkPosition = CatchAsync(async (req, res, next) => {
  const users = await User.find();
  let defective = [];
  users.forEach(function (user) {
    if (user.position.split(" ").length < 2) {
      defective.push(user);
    }
  });
  res.status(200).json({
    status: "success",
    data: {
      users: defective,
    },
  });
});
