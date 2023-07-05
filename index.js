const app = require("./app.js");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const { connToDB } = require("./db/config.js");

async function main() {
  try {
    await connToDB();

    app.listen(PORT, () => {
      console.log(`server up on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
