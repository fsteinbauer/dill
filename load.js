const steps = require('cypress-cucumber-preprocessor/steps');
const resolver = require('cypress-cucumber-preprocessor/lib/resolveStepDefinition');
const waitUntil = require('async-wait-until')

const ws = new WebSocket('ws://localhost:8765')

const replacePlaceholders = (args, text) => {

	let i;
	for (i = 1; i <= args.length; i++){
		text = text.replace(`{arg${i}}`, args[i-1]);
	}
	return text;
};

module.exports = (stepdata) => {

	console.log("Loading picklejs Steps...");

	const values = Object.values(stepdata);
	for (const value of values ){

		value.steps.forEach((config) => {

			steps.defineStep(config.name, function(...args){

				config.steps.forEach((step) => {

					const text = replacePlaceholders(args, step.text);

					const runnable = {
						argument: "undefined",
						keyword: "Then",
						type: "Step",
						text: text
					};

					resolver.resolveAndRunStepDefinition(runnable);
				});
			});
		});
	}


	waitUntil(() => ws.readyState === WebSocket.OPEN, 2000, 50);

	ws.onmessage = ev => {
		console.log('message from OS')
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
	};

	console.log("Done.");
};