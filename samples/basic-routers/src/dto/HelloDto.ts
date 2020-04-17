import { ApiProperty } from '@sustain/common';
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