import {UserService} from './UserService';
import {Module, TestEnvironment} from '@sustain/core';

@Module({
  providers: [UserService],
})
export class UserServiceTestModule {}

let userService: UserService;
describe('UserService', () => {
  beforeAll(async () => {
    const environment: TestEnvironment = new TestEnvironment().buildModule(UserServiceTestModule);
    userService = environment.get(UserService);
  });
  it('should shoud create service', () => {
    expect(userService).toBeDefined();
  });

  it('should shoud has defined list', () => {
    expect(userService.list().length).toBeGreaterThan(0);
  });
});
