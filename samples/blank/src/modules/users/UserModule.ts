import { UserService } from './UserService';
import { Module } from '@sustain/core';
import UserController from './UserController';
@Module({
    controllers: [
        UserController
    ],
    providers: [UserService]
})
export class UserModule { } 