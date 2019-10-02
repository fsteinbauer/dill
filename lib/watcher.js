const chokidar = require('chokidar')
const WebSocket = require('ws')


module.exports = function Watcher()  {

    const wss = new WebSocket.Server({ port: 8765 })
    let client // future Cypress client

    this.watch = (watchedPath, steps, callback) => {

        console.log('will watch "%s"', watchedPath);

        wss.on('connection', function connection (ws) {
            console.log('new socket connection 🎉')
            client = ws

            // TODO clear previous watcher
            chokidar.watch(watchedPath).on('change', (path, event) => {
                console.log('file %s has changed', path);

                callback(path);

                if (client) {
                    callback(path);

                    const text = JSON.stringify({
                        command: 'reload',
                        filename: path
                    })
                    client.send(text)
                }
            });
        });
    }
}