import {
    Controller
} from '@sustain/core';
import {
    Request,
    Param,
    Response,
    Header,
    Query,
    Body,
    Get,
    Post,
} from '@sustain/common';
import { UserService } from "../services/user.service";

@Controller('/users')
export default class UserController {
    constructor(private userService: UserService) { }

    @Get()
    users() {
        return this.userService.list();
    }

    @Get('/:id')
    singleUser(
        @Request() request: any,
        @Response() response: any,
    ): number {
        response.setHeader('Content-Type', 'application/json');

        const { id } = request.params
        return this.userService.get(id);

    }

    @Post('/:id/:name/:lastname')
    user(
        @Param('id') id: string,
        @Param('name') name: string,
        @Param('lastname') lastname: string,
        @Header('host') host: string,
        @Body('nameFromQuery') nameFromQuery: string,
        @Body('username') username: string,
        @Body() body: string
    ) {
        return `
                Host : ${host}
                User details 
                    id : ${id}
                    name : ${name}
                    lastname : ${lastname}
                    nameFromQuery : ${nameFromQuery}
                    username from body  : ${username},
                    body : ${JSON.stringify(body)}
            `;
    }

    /**
     * 
     * @examples:
     * 
     *   using @Params decorator to get all the route params
     *   send response with a return statment
     * 
     *   @Get('/user/:id/details')
     *   userDetails(@Params() params: any) {
     *       const { id } = params
     *       return this.userService.syncGet(id);
     *   }
     * 
     *  using @Response decorator to get the res object
     *  sending responce directely from the res object
     *  @Get('/user/:id/details')
     *  userDetails(@Response() response: any, @Params() params: any) {
     *     const { id } = params
     *     const userDetails  = this.userService.get(id);
     *     response.end(JSON.stringify(userDetails));
     *  }
     * 
     * 
     *  using the @Request decorator to get the request object
     *  @Get('/user/:id/details')
     *  userDetails(@Request() request: any) {
     *      const { id } = request.params;
     *      return this.userService.syncGet(id);
     *  }
     * 
     */

    @Get('/:id/details')
    userDetails(@Request() request: any) {
        const { id } = request.params;
        return this.userService.syncGet(id);
    }


}