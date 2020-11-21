import {SwaggerController} from './SwaggerController';
import {resolve} from 'path';
import {Module} from '@sustain/core';
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();

@Module({
  controllers: [SwaggerController],
  providers: [],
  staticFolders: [
    {
      path: resolve(__dirname, 'public/'),

      option: {
        route: '/swagger-ui',
      },
    },
    {
      path: swaggerUiAssetPath,
      option: {
        route: '/swagger-ui',
      },
    },
  ],
})
export class SwaggerModule {
  onModuleLoadedInit(request: any) {}
}
