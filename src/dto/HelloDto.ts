import { ApiProperty } from "../decorators/core/swagger.decorator";
import { ProfileDto } from "./ProfileDto";

export class UserDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    lastname: string;


    @ApiProperty()
    age: number;


    @ApiProperty()
    profile: ProfileDto;




}