import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body('username') username: string): Promise<User> {
    try {
      return this.usersService.createUser(username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('leaderboard')
  getLeaderboard(): User[] {
    return this.usersService.getLeaderboard();
  }

  @Patch()
  updateSteps(@Body('username') username: string) {
    return this.usersService.updateSteps(username);
  }
}
