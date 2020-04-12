import { UserDto } from './../dto/HelloDto';
import { ProfileDto } from './../dto/ProfileDto';
import { CrudModel } from './../decorators/core/crud-model.decorator';
import { Controller } from "../core/di";
import SustainCrudController from './CrudController'

@Controller('/player')
@CrudModel(UserDto)
export default class PlayerController extends SustainCrudController<UserDto> {
    constructor() {
        super()
    }

}