import { ApiProperty } from '@sustain/common';
import { FileDto } from "./FileDto";

export class ProfileDto {

    @ApiProperty()
    picture: FileDto;

}