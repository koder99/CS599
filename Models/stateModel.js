const mongoose = require("mongoose");
const lodash = require("lodash");

const geopoliticalZones = [
  "North Central",
  "North East",
  "North West",
  "South South",
  "South East",
  "South West",
];

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A state must have a name!"],
    index: 1,
  },
  capital: {
    type: String,
    required: [true, "A state must have a capital!"],
    // enum: {
    //   values: this.localGovernmentAreas,
    //   message: `The Capital must be one of the LGA's!`,
    // },
  },
  slogan: {
    type: String,
    required: [true, "Every state must have a slogan!"],
  },
  geopoliticalZone: {
    type: String,
    required: [true, "A state must belong to a geopolitical zone!"],
    enum: {
      values: geopoliticalZones,
      message: `Appropriate values for the Geopolitical Zones are : ${geopoliticalZones.map(
        function (zone, i, arr) {
          if (i < arr.length - 1) return `${zone},`;
          if (i === arr.length - 2) return `${zone}`;
          if (i === arr.length - 1) return ` and ${zone}.`;
        }
      )}`,
    },
  },
  localGovernmentAreas: {
    type: [String],
    required: [true, `A state must have LGA's passed in the form of an array!`],
  },
  topFiveCities: {
    type: [String],
    required: [true, `A state must have top cities ranked by population!`],
    validate: {
      validator: function (val) {
        if (val.length !== 5) return false;
        else return true;
      },
      message: `The number of cities in the array must be equal to five`,
    },
  },
  ethnicities: {
    type: [String],
    required: [true, "Every State must have ethnicities"],
  },
  createdOn: {
    type: Date,
    required: [true, "A date for the state creation must be provided!"],
  },
  governor: {
    type: mongoose.Schema.ObjectId,
    required: [true, `A state requires a governor!`],
    ref: "User",
    unique: [true, "There cannot be more one state for each governor!"],
  },
  // deputyGovernor: {
  //   type: mongoose.Schema.ObjectId,
  //   required: [true, `A state requires a deputy governor!`],
  //   ref: "User",
  // },
  coordinates: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    required: [true, "The coordinates of the state must be provided"],
  },
  area: {
    type: {
      total: Number, //In square metres
      elevation: Number, // in feet
    },
    required: [true, "Please specify the area data in the right format! "],
  },
  population: {
    type: {
      density: Number,
      rank: Number,
      total: Number,
    },
    required: [true, "The population has to be specified in the right format!"],
  },
  website: {
    type: String,
  },
  timeZone: {
    type: String,
  },
  postalCode: {
    type: Number,
    required: [true, "A state must have a postal code!"],
  },
  gdp: {
    type: {
      year: Number,
      total: String,
      perCapita: String,
    },
  },
  locationOnMap: {
    type: String,
  },
  tertiaryInstitutions: {
    type: {
      universities: [{ name: String, founded: Date }],
      collegesOfEducation: [{ name: String, founded: Date }],
      polytechnics: [{ name: String, founded: Date }],
    },
    required: [true, "Every state must have tertiary institutions!"],
  },
  images: {
    type: [String],
  },
});

stateSchema.pre("save", function (next) {
  for (let i = 1; i <= 5; i++) {
    this.images[i - 1] = `${this.name.toLowerCase()}-state-${i}`;
  }
  this.locationOnMap = `${this.name}'s-location.jpg`;
  this.timeZone = this.timeZone.toUpperCase();
  next();
});

stateSchema.pre("save", function (next) {
  if (this.name.toLowerCase() !== "abuja") {
    this.website = `https://${this.name.toLowerCase()}state.gov.ng/`;
  }

  if (this.name == "Abuja") this.website = `https://fcta.gov.ng`;

  this.numberOfLGA = this.localGovernmentAreas.length;
  this.gdp.perCapita = this.gdp.perCapita.trim();
  this.gdp.total = this.gdp.total.trim();
  next();
});

stateSchema.pre("save", function (next) {
  // Add a link that points to the image on the servers
  this.locationOnMap = `${req.protocol}://${req.get("host")}/img/${
    this.locationOnMap
  }.jpg `;
  let linkedImages = [];
  this.images.forEach(function (image) {
    let linkedImage = `${req.protocol}://${req.get('host')}/img/${image}`;
    linkedImages.push(linkedImage);
  });
  this.images = linkedImages;
  next();
});

stateSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: "governor",
    select: "firstName lastName middleName officePortrait gender age",
  });
  next();
});

const State = mongoose.model("State", stateSchema);
module.exports = State;
