import { isNumber } from "util";

export function isAuthenticated(req: any, res: any, next: any) {
    //console.log('Enter in isAuthenticated');
    //res.end('You are not Authenticated')
    next();
}

export function validateParams(req: any, res: any, next: any) {
    const { id } = req.params;
    // throw  new Error('Hey, handling errors');
    if (isNaN(+id)) {
        res.end('Not a number')
    }
    next();
}