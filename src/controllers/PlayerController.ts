import { CrudModel } from './../../packages/common/decorators/crud-model.decorator';
import {
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Head,
    Options,
    Session,
    Body,
    Params,
    Param,
    Query,
    Headers,
    Header
} from "../../packages/common/decorators/http";
import { Controller } from './../../packages/core/di/injectable';
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