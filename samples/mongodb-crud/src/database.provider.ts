import { UserDto } from './dto/UserDto';
import { SustainContext, Injectable } from "@sustain/core";
import { createConnection } from "typeorm";

@Injectable()
export class DatabaseProvider {
    constructor(private context: SustainContext) {


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
            this.context.set('connection', connection);
        }).catch(error => console.log(error));
    }

}