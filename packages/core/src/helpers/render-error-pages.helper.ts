import {EMPTY_STRING, IS_DEVELOPMENT} from './../constants';
import {readFile} from 'fs';
import {join} from 'path';

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
