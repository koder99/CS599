const mongoose = require("mongoose");
const slug = require("slug");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name!"],
    validate: {
      validator: function (val) {
        if (val.length > 15 || val.length < 3) {
          return false;
        }
      },
      message: `First name must be greater than or equal to 3 characters but not more than 15 characters!`,
    },
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name!"],
    validate: {
      validator: function (val) {
        if (val.length > 15 || val.length < 3) {
          return false;
        }
      },
      message: `Last name must be greater than or equal to 3 characters but not more than 15 characters!`,
    },
  },
  middleName: {
    type: String,
    validate: {
      validator: function (val) {
        if (val.length > 15 || val.length < 3) {
          return false;
        }
      },
      message: `Middle name must be greater than or equal to 3 characters but not more than 15 characters!`,
    },
  },
  gender: {
    type: String,
    required: [true, "Please provide a gender!"],
    enum: {
      values: ["Male", "Female"],
      message: `Gender must either be Male or Female!`,
    },
  },
  dateOfBirth: {
    type: Date,
    required: [true, "A DOB is required in the DD/MM/YY!"],
  },
  age: {
    type: Number,
    validate: {
      validator: function (val) {
        if (val < 35 || val > 85) return false;
      },
      message: `A user (Governor) must be between 35 and 85 years old!`,
    },
  },
  position: {
    type: String,
    required: [true, "Please provide a position!"],
    unique: true,
    index: 1,
  },
  dateSwornIn: {
    type: Date,
    required: [true, "A sworn in date must be provided!"],
  },
  officePortrait: {
    type: String,
  },
  slug: {
    type: String,
  },
});

// METHODS

userSchema.methods.computeAge = function () {
  const currentDate = Date.now();
  this.age = Math.trunc(
    (currentDate - this.dateOfBirth.getTime()) / 31556952000
  );
};

// MIDDLEWARES
userSchema.pre("save", function (next) {
  // COMPUTE THE AGE PROPERTY
  this.computeAge();

  next();
});

userSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slug(this.position, {
      lower: true,
    });
  }
  next();
});
userSchema.pre("save", function (next) {
  // REMOVE WHITESPACES
  this.gender = this.gender.trim();
  if (this.middleName) this.middleName = this.middleName.trim();

  next();
});
userSchema.pre("save", function (next) {
  // SET AN OFFICAL IMAGE
  this.officePortrait = `${this.firstName}-${this.lastName}'s official portrait.png`;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
