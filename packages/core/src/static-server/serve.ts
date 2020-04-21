import { normalize, join, resolve } from "path";
import { existsSync, readFileSync, statSync } from "fs";

/**
 *  TODO : read all files and add prefix, suffix on the boot, then check for exiting files without using the file system
 */
export const serveStatic = (staticPath: any, request: any, response: any) => {
    let resolvedBase;
    let fileLoc;
    var safeSuffix = normalize(request.url).replace(/^(\.\.[\/\\])+/, '');

    if (!staticPath.relative) {
        fileLoc = staticPath.value + safeSuffix;

    } else {
        resolvedBase = resolve(`./public/${staticPath.value}`);
        fileLoc = join(resolvedBase, safeSuffix);
        
    }
    
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
        let data;
        try {
            data = readFileSync(fileLoc);

        } catch (e) {
            console.log("serveStatic -> e", e)
        }
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