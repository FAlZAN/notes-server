function generateOTP(length) {
  let init = String(1).padEnd(length, "0");
  let range = String(9).padEnd(length, "0");
  return Math.floor(parseInt(init, 10) + Math.random() * parseInt(range, 10));
}

module.exports = { generateOTP };
