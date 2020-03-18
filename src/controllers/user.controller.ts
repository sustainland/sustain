import { Get, Post } from "../decorators/http/requests.decorators";
import { Request, Param, Response, Headers, Header, Query, Body } from "../decorators/http/route-params.decorator";
import { Controller } from "../core/di";
import { UserService } from "../services/user.service";
import { Interceptors } from "../decorators/interceptors.decorators";
import { Auth } from "../auth";


@Controller()
export default class UserController {
    constructor(private userService: UserService) { }

    @Get('/users')
    users() {
        return this.userService.list();

    }

    @Get('/user/:id')
    singleUser(
        @Request() request: any,
        @Query() query: any,
        @Query('name') name: string
    ) {
        console.log("UserController -> singleUser -> query", name)
        const { id } = request.params
        return this.userService.get(id);

    }

    @Post('/user/:id/:name/:lastname')
    user(
        @Param('id') id: string,
        @Param('name') name: string,
        @Param('lastname') lastname: string,
        @Header('host') host: string,
        @Query('nameFromQuery') nameFromQuery: string,
        @Body() body: any
        ) {
            console.log("UserController -> constructor -> body", body)
        return `
                Host : ${host}
                User details 
                    id : ${id}
                    name : ${name}
                    lastname : ${lastname}
                    nameFromQuery : ${nameFromQuery}
                    username from body  : ${body.username}
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

    @Interceptors([
        Auth.isAuthenticated
    ])
    @Get('/user/:id/details')
    userDetails(@Request() request: any) {
        const { id } = request.params;
        return this.userService.syncGet(id);
    }


}