import { CrudModel, Delete, Param } from '@sustain/common';
import { Controller } from '@sustain/core';
import { PlayerDto } from '../dto/PlayerDto';
import { TypeORMCrudController } from '@sustain/crud';

@Controller('/player')
@CrudModel(PlayerDto)
export default class PlayerController extends TypeORMCrudController<PlayerDto> {
    constructor() {
        super(PlayerDto)
    }

    // @Delete(':id') 
    // overridedDelete(@Param('id') id: string) {
    //     // A validation process here, you can use Interceptors 
    //     return 'You are not authorized to run delete operation';
    // }
}