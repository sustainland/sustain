/*jshint esversion: 9 */

const { spawn, exec } = require('child_process');
require('source-map-support').install({
    environment: 'node'
  });

const TypeScriptCompileWatchProcess = exec('npm run watch-ts');
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
    appProcess = spawn('node', ['dist/app.js','--inspect']);
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
    stopAppServer();
    startAppServer();
}