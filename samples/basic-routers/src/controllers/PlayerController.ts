import { CrudModel } from '@sustain/common';
import { Controller } from '@sustain/core';
import { UserDto } from './../dto/HelloDto';
import { ProfileDto } from './../dto/ProfileDto';
import SustainCrudController from './CrudController'

@Controller('/player')
@CrudModel(UserDto)
export default class PlayerController extends SustainCrudController<UserDto> {
    constructor() {
        super()
    }

}