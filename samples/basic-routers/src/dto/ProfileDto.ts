import { JoinColumn } from 'typeorm';
import { Column, ObjectIdColumn, ObjectID, OneToOne } from 'typeorm';
import { ApiProperty } from '@sustain/common';
import { FileDto } from "./FileDto";
import { Entity } from 'typeorm';
@Entity()
export class ProfileDto {

    @ObjectIdColumn()
    id: ObjectID;
    
    @ApiProperty()
    picture: FileDto;

}