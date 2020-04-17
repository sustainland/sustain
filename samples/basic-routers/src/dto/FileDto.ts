import { ApiProperty } from '@sustain/common';

export class FileDto {

    @ApiProperty()
    path: string;

    @ApiProperty()
    size: string;

}