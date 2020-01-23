
const { readFile } = require('fs');
import { createServer, IncomingMessage, ServerResponse } from 'http';
const port = 5000;

export function createAppServer(requests: any) {
    const server = createServer((request: IncomingMessage, response: ServerResponse) => {

        response.setHeader('x-powered-by', 'Sustain Server');
        if (requests[request.method]) {
            const route = requests[request.method].find((route: any) => {
                if (route.path.value == request.url) {
                    return true;
                }
            })
            if (route) {
                route.handler(request, response);
            } else {
                readFile('views/404.html', (err: any, data: any) => {
                    if (!err) {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(data);
                    } else {
                        console.log(err)
                    }
                })
            }
        } else {
            readFile('../views/404.html', (err: any, data: any) => {
                if (!err) {
                    response.end(data);
                }
            })

        }

        response.on('close', () => {
            console.timeEnd('response');

        })

    });
    server.listen(port).on('listening', () => {
        console.log(
            "  App is running at http://localhost:%d in %s mode",
            port,
            'debug'
        );
        console.log("  Press CTRL-C to stop\n");
    });
    server.on('error', (error: Error) => {
        console.log(error);
    });

}
