import { ApiProperty } from "../decorators/core/swagger.decorator";
import { FileDto } from "./FileDto";

export class ProfileDto {

    @ApiProperty()
    picture: FileDto;

}