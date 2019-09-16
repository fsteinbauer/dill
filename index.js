const fs = require("fs");


module.exports = () => {
  const appRoot = process.cwd();

  const cypressOptions = JSON.parse(
    fs.readFileSync(`${appRoot}/cypress.json`, "utf-8")
  );

  console.log(cypressOptions);

}