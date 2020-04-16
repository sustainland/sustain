import { Injectable } from "../../packages/core/di";
import {
    Get,
    Post,
    Body,
    Patch,
    Put,
    Delete,
    Param,
    Head,
    Options
} from "../../packages/common/decorators/http";



@Injectable()
export default class SustainCrudController<T> {
    constructor() {
    }

    @Get()
    find() { return 200 }

    @Post()
    createPost(@Body() body: T): T {
        return body;
    }

    @Patch()
    patch(@Body('id') id: string) { return 200 }

    @Put()
    put(@Body('id') id: string) { return 200 }

    @Delete()
    delete(@Param('id') id: string) { return 200 }

    @Get(':id')
    findOne() { return 200 }

    @Head()
    headMethod() {
        return 200;
    }

    @Options()
    optionsMethod() {
        return 200;
    }

}