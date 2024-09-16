const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_STRING.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

(async function () {
  try {
    const con = await mongoose.connect(DB);
    console.log(`Database connection successful!`);
  } catch (error) {
    console.log(`Something went wrong with the database connection`);
    console.log(error);
  }
})();

const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening for incoming connections on port ${port}`);
});
