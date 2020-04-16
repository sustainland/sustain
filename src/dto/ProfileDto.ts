import { ApiProperty } from "../../packages/common/decorators/swagger.decorator";
import { FileDto } from "./FileDto";

export class ProfileDto {

    @ApiProperty()
    picture: FileDto;

}