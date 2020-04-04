import { normalize, join, resolve } from "path";
import { existsSync, readFileSync, statSync } from "fs";

export const serveStatic = (staticBasePath: string, request: any, response: any) => {
    const fullPath = `./public/${staticBasePath}`;

    var resolvedBase = resolve(fullPath);

    var safeSuffix = normalize(request.url).replace(/^(\.\.[\/\\])+/, '');
    var fileLoc = join(resolvedBase, safeSuffix);
    console.log('99')

    if (!request.url.endsWith('/')) {
        if (statSync(fileLoc).isDirectory()) {
            console.log(request.url, 'is folder')
            response.writeHead(301,
                { Location: `${request.url}/` }
            );
            response.end();
        }
    }

    if (existsSync(fileLoc)) {
        request.staticFileExist = true;
        const data = readFileSync(fileLoc);
        if (!data) {
            response.writeHead(404, 'Not Found');
            response.write('404: File Not Found!');
            return response.end();
        } else {
            response.statusCode = 200;
            response.write(data);
            return response.end();
        }
    }

}