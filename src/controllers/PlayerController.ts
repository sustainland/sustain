import { Controller } from "../core/di";
import SustainCrudController from './CrudController'
import { FileDto } from "../dto/FileDto";

@Controller('/player')
export default class PlayerController extends SustainCrudController<FileDto> {
    constructor() {
        super()
    }

}