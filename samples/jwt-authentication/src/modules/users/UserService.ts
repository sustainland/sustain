import { Injectable } from "@sustain/core";

@Injectable()
export class UserService {
    private users = [
        {
            "_id": "5e3430685106fe9e0f16e9f8",
            "age": 39,
            "name": "Janell Estrada",
            "gender": "female",
            "company": "ROOFORIA",
            "email": "janellestrada@rooforia.com",
            "phone": "+216 (932) 488-2871",
            "address": "707 Withers Street, Worton, California, 9385",
            "registered": "2019-11-16T08:35:02 -01:00"
        },
        {
            "_id": "5e34306810bd9ef2483a947b",
            "age": 35,
            "name": "Millicent Rojas",
            "gender": "female",
            "company": "MAGNEMO",
            "email": "millicentrojas@magnemo.com",
            "phone": "+216 (981) 519-3442",
            "address": "533 Stuyvesant Avenue, Blende, Tennessee, 9506",
            "registered": "2014-08-16T08:02:06 -01:00"
        }
    ]
    constructor() { }

    get(id: string) {
        return this.users.find((user: any) => user._id === id);
    }

    list() {
        return this.users;
    }
}

