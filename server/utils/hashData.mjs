import bcrypt from "bcrypt"; //password handler

const hashData = async (data, saltRounds = 10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;

  } catch (error) {
    throw error;
  }
};

const verifyHashedData = async (unhashed, hashed) => {
  try {
    const match = await bcrypt.compare(unhashed, hashed);
    //console.log(match);
    //if password matches it will return true
    return match;
  } catch (error) {
    throw error;
  }
}

export { hashData, verifyHashedData };
