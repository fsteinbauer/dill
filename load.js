const steps = require('cypress-cucumber-preprocessor/steps');
const resolver = require('cypress-cucumber-preprocessor/lib/resolveStepDefinition');

module.exports = () => {

	console.log("Loading picklejs Steps...");

	const stepConfig = Cypress.config('steps');
	stepConfig[0].steps.forEach((config) => {

		steps.defineStep(new RegExp(config.name), function(){

			config.steps.forEach((step) => {

				const runnable = {
					argument: "undefined",
					keyword: "When",
					type: "Step",
					text: step.text
				}

				resolver.resolveAndRunStepDefinition(runnable);
			});
		});
	});

	console.log("Done.");
}