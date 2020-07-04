import { ContextEvents } from '../constants';

import { Injectable, getContext } from '@sustain/core';
import {
    Get,
    Post,
    Body,
    Patch,
    Put,
    Delete,
    Param,
} from '@sustain/common';
import { Repository } from 'typeorm';



@Injectable()
export class TypeORMCrudController<T> {
    repository: Repository<any>;
    connexion: any;
    constructor(private model: any) {
        getContext().on(ContextEvents.TypeORMDataBaseConnexion)
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

            }
        );
        return body;
    }

    @Patch()
    patch(@Body('id') id: string) { return 200 }

    @Put()
    put(@Body('id') id: string) { return 200 }

    /**
     * Delete Entity
     * @param {string} id
     * @returns
     * @memberof TypeORMCrudController
     */
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.repository.delete(id);
    }

    /**
     * Find Entity by ID
     * @param {string} id
     * @returns
     * @memberof TypeORMCrudController
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.repository.findOne(id);
    }

}