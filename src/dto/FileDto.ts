import { ApiProperty } from "../decorators/core/swagger.decorator";

export class FileDto {

    @ApiProperty()
    path: string;

    @ApiProperty()
    size: string;

}