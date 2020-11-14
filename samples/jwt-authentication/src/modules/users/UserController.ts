import { UserService } from './UserService';
import {
    Controller
} from '@sustain/core';
import {
    Get,
    Response,
    Param
} from '@sustain/common';

@Controller('/user')
export default class UserController {
    constructor(private userService: UserService) { }

    @Get()
    allUsers(): any[] {
        return this.userService.list();
    }


    @Get('/:id')
    singleUser(
        @Response() response: any,
        @Param('id') id: string,
    ): any {
        response.setHeader('Content-Type', 'application/json');
        return this.userService.get(id);
    }
}