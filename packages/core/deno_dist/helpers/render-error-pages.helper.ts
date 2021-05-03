const __dirname = (() => {
    const { url: urlStr } = import.meta;
    const url = new URL(urlStr);
    const __filename = (url.protocol === "file:" ? url.pathname : urlStr)
        .replace(/[/][^/]*$/, '');

    const isWindows = (() => {

        let NATIVE_OS: typeof Deno.build.os = "linux";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navigator = (globalThis as any).navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.("Win") ?? false) {
            NATIVE_OS = "windows";
        }

        return NATIVE_OS == "windows";

    })();

    return isWindows ?
        __filename.split("/").join("\\").substring(1) :
        __filename;
})();

import {EMPTY_STRING, IS_DEVELOPMENT} from './../constants.ts';
import {readFile} from 'https://deno.land/std@0.85.0/node/fs.ts';
import {join} from 'https://deno.land/std@0.85.0/node/path.ts';

export function renderErrorPage(response: any, error: any) {
  readFile(join(__dirname, '../public/404.html'), (err: any, data: any) => {
    if (!err) {
      data = data.toString();
      data = data.replace('#error_message', error);
      data = data.replace('#status_code', response.statusCode);
      data = data.replace('#error', IS_DEVELOPMENT ? error.stack : EMPTY_STRING);
      response.end(data);
    } else {
      console.log(err);
    }
  });
}

export function render505Page(response: any) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  readFile(join(__dirname, '../views/500.html'), (err: any, data: any) => {
    if (!err) {
      response.end(data);
    } else {
      console.log(err);
    }
  });
}
