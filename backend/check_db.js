const mongoose = require("mongoose");
const Transaction = require("./src/models/Transaction");
require("dotenv").config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Transaction.countDocuments({});
  console.log("TOTAL TRANSACTIONS:", count);
  const all = await Transaction.find({}).limit(5);
  console.log("TYPES FOUND:", all.map(t => t.type));
  process.exit();
}
check();
