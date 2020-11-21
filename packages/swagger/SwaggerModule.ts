import {SwaggerController} from './SwaggerController';
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();

import {Module} from '@sustain/core';
@Module({
  controllers: [SwaggerController],
  providers: [],
  staticFolders: [
    {
      path: swaggerUiAssetPath,
    },
  ],
})
export class SwaggerModule {
  onModuleLoadedInit(request: any) {}
}
