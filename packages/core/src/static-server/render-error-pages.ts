import { readFile } from "fs";
import { join } from "path";

export function render404Page(response: any) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    readFile(join(__dirname, '../public/404.html'), (err: any, data: any) => {
        if (!err) {
            response.end(data);
        } else {
            console.log(err)
        }
    })
}

export function render505Page(response: any) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    readFile(join(__dirname, '../views/500.html'), (err: any, data: any) => {
        if (!err) {
            response.end(data);
        } else {
            console.log(err);
        }
    })
}