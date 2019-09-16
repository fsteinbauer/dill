var Parser = require('./parser')
var Compiler = require('./pickles/compiler')


const inst = new Parser();
const gherkinDocument = inst.parse("Step: ASDF\nWhen I go to church AND I meet Hozier \n \n Step: testt \n When I do this");

console.log(gherkinDocument);

// var pickles = new Compiler().compile(gherkinDocument);

// console.log(pickles);