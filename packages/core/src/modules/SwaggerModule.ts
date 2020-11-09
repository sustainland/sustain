import {SWAGGER_FOLDER} from '@sustain/common';
import {Module} from './../decorators/module.decorator';
@Module({
  staticFolders: [
    {
      path: SWAGGER_FOLDER,
    },
  ],
})
export class SwaggerModule {}
