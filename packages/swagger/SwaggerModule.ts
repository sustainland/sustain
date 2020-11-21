import {SwaggerddController} from './SwaggerController';
import {resolve} from 'path';

import {Module} from '@sustain/core';
@Module({
  controllers: [SwaggerddController],
  providers: [],
  staticFolders: [
    {
      path: resolve(__dirname, 'public/'),
    },
  ],
})
export class SwaggerModule {
  onModuleLoadedInit(request: any) {}
}
