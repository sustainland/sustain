import { ContextEvents } from '../constants';

import { Injectable, getContext } from '@sustain/core';
import {
    Get,
    Post,
    Body,
    Patch,
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

    /**
     * Get list of entites
     * @returns {*}
     * @memberof TypeORMCrudController
     */
    @Get()
    find(): any {
        return this.repository.find();
    }

    /**
     * Create new entity
     * @param {T} body
     * @returns {Promise<any>}
     * @memberof TypeORMCrudController
     */
    @Post()
    createPost(@Body() body: T): any {
        return this.repository.save(body);
    }

    /**
     * Partial update entity
     * @param {string} id
     * @param {T} body
     * @returns
     * @memberof TypeORMCrudController
     */
    @Patch()
    patch(@Param('id') id: string, @Body() body: T) {
        return this.repository.update(id, body);
    }

    /**
     * Delete Entity
     * @param {string} id
     * @returns
     * @memberof TypeORMCrudController
     */
    @Delete(':id')
    delete(@Param('id') id: string): any {
        return this.repository.delete(id);
    }

    /**
     * Find Entity by ID
     * @param {string} id
     * @returns
     * @memberof TypeORMCrudController
     */
    @Get(':id')
    findOne(@Param('id') id: string): any {
        return this.repository.findOne(id);
    }

}