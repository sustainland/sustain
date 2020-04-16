import { ApiProperty } from "../../packages/common/decorators/swagger.decorator";
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