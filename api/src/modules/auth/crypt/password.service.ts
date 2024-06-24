import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor() {}
  async genSalt(): Promise<string> {
    return bcrypt.genSalt();
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await this.genSalt();
    return bcrypt.hash(password, salt);
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
