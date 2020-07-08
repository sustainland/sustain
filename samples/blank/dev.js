/*jshint esversion: 9 */

const { spawn, exec } = require('child_process');
require('source-map-support').install({
    environment: 'node'
});

const TypeScriptCompileWatchProcess = exec('npm run build-watch');
let appProcess;

TypeScriptCompileWatchProcess
    .stdout.on('data', function (data) {
        console.log(data.toString());
        if (data.toString().indexOf('Found 0 errors') !== - 1) {
            restartAppServer();
        }
    });
TypeScriptCompileWatchProcess
    .stderr.on('data', function (data) {
        console.log(data.toString());
    });


function startAppServer() {
    appProcess = spawn('node', ['dist/app.js', '--inspect', '--port=5003']);
    appProcess.stdout.on('data', function (data) {
        console.log(data.toString());
    });
}

function stopAppServer() {
    if (appProcess && !appProcess.killed) {
        appProcess.kill();
    }
}

function restartAppServer() {
    try {
        stopAppServer();
        startAppServer();
    } catch (e) {
        console.log("restartAppServer -> e", e)
    }

}