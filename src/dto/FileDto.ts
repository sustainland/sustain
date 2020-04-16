import { ApiProperty } from "../../packages/common/decorators/swagger.decorator";

export class FileDto {

    @ApiProperty()
    path: string;

    @ApiProperty()
    size: string;

}