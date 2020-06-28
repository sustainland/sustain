
import { Injectable, getContext } from '@sustain/core';
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
import { getRepository, Repository } from 'typeorm';



@Injectable()
export class SustainCrudController<T> {
    repository: Repository<any>;
    connexion: any;
    constructor(private model: any) {
        getContext().on('connexion')
            .subscribe((payload: any) => {
                this.connexion = payload.value;
                this.repository = this.connexion.getRepository(this.model);
            })
    }

    @Get()
    find() {
        return this.repository.find();
    }


    @Post()
    createPost(@Body() body: T): T {
        this.repository.save(body).then(
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
    findOne(@Param('id') id: string) {
        return this.repository.findOne(id);
    }

    @Head()
    headMethod() {
        return 200;
    }

    @Options()
    optionsMethod() {
        return 200;
    }



}