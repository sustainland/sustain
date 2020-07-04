import { ApiProperty } from '@sustain/common';
import { Entity, Column } from "typeorm";

@Entity()
export class FileDto {
    @Column()
    @ApiProperty()
    path: string;

    @ApiProperty()
    size: string;

}