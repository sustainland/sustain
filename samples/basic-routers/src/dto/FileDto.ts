import { ApiProperty } from '@sustain/common';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";

@Entity()
export class FileDto {
    @Column()
    @ApiProperty()
    path: string;

    @ApiProperty()
    size: string;

}