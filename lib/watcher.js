const chokidar = require('chokidar');
const WebSocket = require('ws');


module.exports = function Watcher()  {

    let wss;
    let client; // future Cypress client
    let watcher;

    /**
     *
     * @param watchedPath array
     * @param steps
     * @param callback
     */
    this.watch = (watchedPath, steps, callback) => {

        console.log('will watch "%s"', watchedPath);

        wss = new WebSocket.Server({ port: 8765 });

        wss.on('connection', function connection (ws) {
            console.log('new socket connection 🎉');
            client = ws;

            // Clear old watcher
            if(typeof(watcher) !== 'undefined'){
                watcher.unwatch(watchedPath);
            }

            // Watch for changes and restart the tests
            watcher = chokidar.watch(watchedPath);
            watcher.on('change', (path, event) => {
                console.log('file %s has changed', path);

                if (client) {
                    callback(path);

                    const text = JSON.stringify({
                        command: 'reload',
                        filename: path
                    });
                    client.send(text)
                }
            });
        });
    }
};