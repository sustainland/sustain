import { PlayerInterceptors } from './../interceptors/player.interceptors';
import { CanLogin } from './../interceptors/can-login.interceptor';
import { CrudModel, Param, Interceptors, Get } from '@sustain/common';
import { Controller } from '@sustain/core';
import { PlayerDto } from '../dto/PlayerDto';
import { TypeORMCrudController } from '@sustain/crud';

@Controller('/player', {
    interceptors: [
        PlayerInterceptors
    ]
})
@CrudModel(PlayerDto)
export default class PlayerController extends TypeORMCrudController<PlayerDto> {
    constructor() {
        super(PlayerDto)
    }

    @Interceptors([CanLogin])
    @Get('/:id')
    overridedDelete(@Param('id') id: string) {
        // A validation process here, you can use Interceptors 
        return 'You are not authorized to run delete operation';
    }
}