import {HelloService} from './HelloService';
import {Module, TestEnvironment} from '@sustain/core';

@Module({
  providers: [HelloService],
})
export class HelloServiceTestModule {}

let helloService: HelloService;
describe('HelloService', () => {
  beforeAll(async () => {
    const environment: TestEnvironment = new TestEnvironment().buildModule(HelloServiceTestModule);
    helloService = environment.get(HelloService);
  });
  it('should shoud create service', () => {
    expect(helloService).toBeDefined();
  });
});
