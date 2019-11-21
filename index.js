const Parser = require('./lib/parser');
const Compiler = require('./lib/pickles/compiler');
const Watcher = require('./lib/watcher');
const fs = require('fs');
const glob = require('glob');

const parserObj = new Parser();
const watcherObj = new Watcher();


let path = undefined;

let cypressOptions = undefined;
const appRoot = process.cwd();



/**
 *  This function loads the cypress config array
 */
const loadCypressOptions = () => {

    if("undefined" === typeof cypressOptions) {
        cypressOptions = JSON.parse(
            fs.readFileSync(`${appRoot}/cypress.json`, "utf-8")
        );
        if("undefined" !== typeof cypressOptions.dill){
            cypressOptions = cypressOptions.dill;
        }
    }
};

/**
 * Returns the path of the of the stepDefinitons file
 *
 * @returns {string|number}
 */
const getStepsPath = () => {

    loadCypressOptions();
    const path = cypressOptions.stepDefinitions;

    if(typeof path === "undefined"){
        console.error("Error: Property 'stepsDefinitions' not set in cypress.json");
        return -1;
    }

    return path;
};

/**
 * Reads a steps file and loads the parses the data
 *
 * @param file
 * @throws {CompositeParserException} Will throw an error if the file can't be parsed
 * @returns {GherkinDocument}
 */
const loadSteps = (path) => {

    const data = fs.readFileSync(path, 'utf-8');
    const ast = parserObj.parse(data);

    return ast;
};

/**
 * All the steps get printed to a temporary file, which will be read in the test case execution
 *
 * @param steps
 */
const writeStepsToFile = (steps) => {

    const path = cypressOptions.stepDefinitionTemp;

    fs.writeFile(path, JSON.stringify(steps), (err) => {
        if (err) {
            console.error(`Error: Could not write to file ${path}`);
            return;
        }
        console.log(`Wrote steps file: ${path}`);
    });
};

/**
 * If the contents of the path change, the test will automatically reload
 *
 * @param files array
 * @param steps
 */
const watchForChanges = (files, steps) => {
    watcherObj.watch(files, steps, (file) => {
        steps[file.replace(/\\/g, '/')] = loadSteps(file);
        writeStepsToFile(steps);
    });
};



module.exports = () => {

    let steps = {};

    path = getStepsPath();

    let files = glob.sync(`${path}`);

    let i;
    for(i = 0; i < files.length; i++) {
        let file = files[i];
        console.log(`parsing: ${file}`);
        let result = loadSteps(file);
        steps[file.replace(/\\/g, '/')] = result;
    }

    writeStepsToFile(steps);

    watchForChanges(files, steps);

};
