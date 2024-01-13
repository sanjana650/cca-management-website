const bcrypt = require("bcrypt"); //password handler

// hash the data
const hashData = async (data, saltRounds = 10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw error;
  }
};

// check if the user given (hashed) data matches the hashed data stored in db
const verifyHashedData = async (unhashed, hashed) => {
  try {
    const match = await bcrypt.compare(unhashed, hashed);
    // console.log(match);
    // if password matches it will return true
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashData, verifyHashedData };
