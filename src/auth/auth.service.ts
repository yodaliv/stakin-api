import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';
import { RegisterUserDto } from './dtos/register-user.dto';
import { TokenResponse } from '../common/models/token.response';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<TokenResponse> {
    const payload = {
      fullName: user.fullName,
      id: user.id,
      email: user.email,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerUser(
    dto: RegisterUserDto,
    throwError = true,
  ): Promise<TokenResponse> {
    const user = await this.usersService.addUser(dto, throwError);
    return this.login(user);
  }
}
