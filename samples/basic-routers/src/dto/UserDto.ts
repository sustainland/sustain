import { Column, ObjectIdColumn, ObjectID } from 'typeorm';
import { ApiProperty } from '@sustain/common';
import { ProfileDto } from "./ProfileDto";
import { Entity } from 'typeorm';

@Entity()
export class PlayerDto {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    lastname: string;

    @Column()
    @ApiProperty()
    age: number;

    @Column()
    @ApiProperty()
    profile: ProfileDto;




}