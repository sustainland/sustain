import { CrudModel } from '@sustain/common';
import { Controller } from '@sustain/core';
import { UserDto } from '../dto/UserDto';
import { SustainCrudController } from '@sustain/crud';

@Controller('/player')
@CrudModel(UserDto)
export default class PlayerController extends SustainCrudController<UserDto> {
    constructor() {
        super(UserDto)
    }

}