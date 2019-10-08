const steps = require('cypress-cucumber-preprocessor/steps');
const resolver = require('cypress-cucumber-preprocessor/lib/resolveStepDefinition');
const waitUntil = require('async-wait-until')

const ws = new WebSocket('ws://localhost:8765')


module.exports = (stepdata) => {

	console.log("Loading picklejs Steps...");

	console.log(stepdata);

	stepdata[0].steps.forEach((config) => {

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


	waitUntil(() => ws.readyState === WebSocket.OPEN, 2000, 50);

	ws.onmessage = ev => {
		console.log('message from OS')
		console.log(ev)
		if (ev.type === 'message' && ev.data) {
			try {
				const data = JSON.parse(ev.data)
				if (data.command === 'reload' && data.filename) {
					console.log(
						'reloading Cypress because "%s" has changed',
						data.filename
					);
					window.top.document.querySelector('.reporter .restart').click()
				}
			} catch (e) {
				console.error('Could not parse message from plugin')
				console.error(e.message)
				console.error('original text')
				console.error(ev.data)
			}
		}
	}

	console.log("Done.");
}