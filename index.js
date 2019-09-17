const fs = require('fs');
const Parser = require('./lib/parser')
const Compiler = require('./lib/pickles/compiler')

const parserObj = new Parser();


module.exports = (config) => {
  const appRoot = process.cwd();


  const cypressOptions = JSON.parse(
    fs.readFileSync(`${appRoot}/cypress.json`, "utf-8")
  );



  config.steps = [];

  cypressOptions.steps.forEach((path) => {
  	const content = fs.readFileSync(`${appRoot}/${path}`, "utf-8");

  	const ast = parserObj.parse(content);
  	
  	config.steps.push(ast)
  });


  console.log(config);

  return config;
}

