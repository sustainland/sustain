import { RequestMethod } from "../enums/request-method.enum";
import { ContentType } from "../enums/content-type.enum";

export async function prepareBody(request: any, response: any) {
    let body: any = [];
    if (request.method === RequestMethod.POST) {
        return await new Promise((resolved, reject) => {
            request.on('data', (chunk: any) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                if (request.headers['content-type'] == ContentType.APPLICATION_JSON) {
                    try {
                        body = JSON.parse(body.replace(/\\/g, ""));
                    } catch (error) {
                        response.statusCode = 500;
                        response.end(error.toString())
                        response.destroy();
                    }
                }
                resolved(body);
            }).on('error', (error: any) => {
                console.log("server -> error", error)
                reject()
            });
        });
    }
}