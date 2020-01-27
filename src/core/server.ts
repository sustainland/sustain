
const { readFile } = require('fs');
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { MATCH_METADATA } from '../constants';
const port = 5002;
class Request extends IncomingMessage {
    params: { [key: string]: string | undefined };
}
export function createAppServer(requests: any) {
    const server = createServer(async (request: Request, response: ServerResponse) => {
        try {
            response.setHeader('x-powered-by', 'Sustain Server');
            if (requests[request.method]) {
                const route = requestSegmentMatch(requests, request);
                if (route) {
                    if (route.interceptors) {
                        await executeInterceptor(route, request, response)
                    }
                    route.handler(request, response);

                } else {
                    render404Page(response);
                }
            } else {
                render404Page(response);
            }
            response.on('error', (error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);

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

async function executeInterceptor(route: any, request: any, response: any) {
    const callstack = [];
    for (let interceptor of route.interceptors) {
        callstack.push(new Promise((resolve, reject) => {
            return interceptor(request, response, resolve)
        }))
    }
    return Promise.all(callstack)
        .catch((e: Error) => {
            console.log('\x1b[31m%s\x1b[0m', `${e.message}, ${e.stack}`);
            response.end(`${e.message}, ${e.stack}
            `)

            throw e;
        })
}


function render404Page(response: any) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    readFile('../views/404.html', (err: any, data: any) => {
        if (!err) {
            response.end(data);
        }
    })
}

function requestSegmentMatch(requests: any, request: any) {
    return requests[request.method].find((route: any) => {
        const requestRouteDetails = route.path.match(request.url);
        if (requestRouteDetails) {
            request.params = requestRouteDetails.params
            return true;
        }
    })
}