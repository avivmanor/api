import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/users/user.interface';

const usersFilePath = path.resolve(__dirname, '../../src/data/users.json');

export function readUsersFromFile() {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
}

export function writeUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

export function sortBySteps(users: User[]): User[] {
  users.sort((a, b) => {
    if (a.steps < b.steps) {
      return 1;
    }
    if (a.steps > b.steps) {
      return -1;
    }
    return 0;
  });

  return users;
}
