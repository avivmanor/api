import { Injectable } from '@nestjs/common';
import {
  readUsersFromFile,
  sortBySteps,
  writeUsersToFile,
} from 'src/data/data-utils';
import { GenderEnum, User } from './user.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  public async createUser(username: string): Promise<User> {
    const users = readUsersFromFile();

    const userExists = users.find((user) => user.username === username);

    // If the user exists return it:
    if (userExists) {
      return userExists;
    }
    // Call genderize.io and randomuser.me:
    try {
      const genedrizeUrl = `https://api.genderize.io?name=${username}`;
      const { data: genderData } = await firstValueFrom(
        this.httpService.get(genedrizeUrl),
      );

      let gender = GenderEnum.UNDETERMINED;
      if (genderData.probability > 0.95) {
        gender =
          genderData.gender === GenderEnum.MALE
            ? GenderEnum.MALE
            : GenderEnum.FEMALE;
      }

      const randomUserUrl = `https://randomuser.me/api/?gender=${genderData.gender}&inc=nat,location,email,phone`;
      const { data: userData } = await firstValueFrom(
        this.httpService.get(randomUserUrl),
      );
      const details = userData?.results[0];

      // Add the new user to the user array and overwrite the "db" file
      users.push({
        id: users.length + 1,
        username: username,
        steps: 0,
        gender: gender,
        nationality: details.nat,
        location: details.location,
        phone: details.phone,
        email: details.email,
      });
      writeUsersToFile(users);
      return users[users.length - 1];
    } catch (err) {
      throw new Error('failed to create new user');
    }
  }

  public getLeaderboard(): User[] {
    const users = readUsersFromFile();
    sortBySteps(users);
    return users;
  }

  public updateSteps(username: string): void {
    const users = readUsersFromFile();
    const requestedUser = users.find((user) => user.username === username);
    requestedUser.steps++;
    writeUsersToFile(users);
  }
}
