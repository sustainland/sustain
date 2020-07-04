import { CrudModel } from '@sustain/common';
import { Controller } from '@sustain/core';
import { UserDto } from '../dto/UserDto';
import { TypeORMCrudController } from '@sustain/crud';

@Controller('/player')
@CrudModel(UserDto)
export default class PlayerController extends TypeORMCrudController<UserDto> {
    constructor() {
        super(UserDto)
    }

}