import { UserDto } from './dto/UserDto';
import { SustainContext, Injectable, getContext } from "@sustain/core";
import { createConnection } from "typeorm";

@Injectable()
export class DatabaseProvider {
    constructor() {


        createConnection({
            type: "mongodb",
            host: "localhost",
            port: 27017,
            database: "sustain_test",

            entities: [
                UserDto
            ],
            synchronize: true,
            logging: false
        }).then(connection => {
            getContext().set('connexion', connection);
        }).catch(error => console.log(error));
    }

}