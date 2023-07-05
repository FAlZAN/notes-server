const bcrypt = require("bcrypt");

async function hashData(data, saltRound = 10) {
  try {
    const hashedData = await bcrypt.hash(String(data), saltRound);
    return hashedData;
  } catch (error) {
    throw error;
  }
}

async function matchData(currentData, persistedData) {
  try {
    const match = await bcrypt.compare(String(currentData), persistedData);
    return match;
  } catch (error) {
    throw error;
  }
}

module.exports = { hashData, matchData };
