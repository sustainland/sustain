
import { Injectable } from '@sustain/core';
import {
    Get,
    Post,
    Body,
    Patch,
    Put,
    Delete,
    Param,
    Head,
    Options
} from '@sustain/common';
import { getRepository } from 'typeorm';



@Injectable()
export default class SustainCrudController<T> {
    repository: any;
    constructor(private model: any) {
    }

    @Get()
    find() {
        const findPromise = new Promise((resolve, reeject) => {
            getRepository(this.model).find().then(
                (value) => {
                    resolve(JSON.stringify(value))
                }
            )
        })
       
        return findPromise
    }


    @Post()
    createPost(@Body() body: T): T {
        getRepository(this.model).save(body).then(
            (value) => {
                console.log("SustainCrudController<T> -> find -> value", value)

            }
        );
        return body;
    }

    @Patch()
    patch(@Body('id') id: string) { return 200 }

    @Put()
    put(@Body('id') id: string) { return 200 }

    @Delete()
    delete(@Param('id') id: string) { return 200 }

    @Get(':id')
    findOne() { return 200 }

    @Head()
    headMethod() {
        return 200;
    }

    @Options()
    optionsMethod() {
        return 200;
    }



}