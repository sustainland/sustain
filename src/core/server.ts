
const { readFile } = require('fs');
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { MATCH_METADATA } from '../constants';
const port = 5002;
class Request extends IncomingMessage {
    params: { [key: string]: string | undefined };
}
export function createAppServer(requests: any) {
    const server = createServer((request: Request, response: ServerResponse) => {
        try {
            response.setHeader('x-powered-by', 'Sustain Server');
            if (requests[request.method]) {
                const route = requests[request.method].find((route: any) => {
                    const requestRouteDetails = route.path.match(request.url);
                    if (requestRouteDetails) {
                        request.params = requestRouteDetails.params
                        return true;
                    }
                })
                if (route) {
                    if (route.interceptors) {
                        try {
                            const callstack = [];
                            for (let interceptor of route.interceptors) {
                                callstack.push(new Promise((resolve, reject) => {
                                    return interceptor(request, response, resolve)
                                }))
                            }
                            Promise.all(callstack)
                                .catch((e: Error) => {
                                    console.log('\x1b[31m%s\x1b[0m', `${e.message}, ${e.stack}`);
                                    response.end(`${e.message}, ${e.stack}
                                `)

                                    throw e;
                                })

                        } catch (e) {
                            console.log(e)
                        }
                    }
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
            response.on('error', (error) => {
                console.log(error)
            })
        } catch (e) {
            console.log('e: ', e);

        }
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
