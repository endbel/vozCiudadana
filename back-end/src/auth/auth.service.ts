import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(userId: string, email: string) {
    const payload = { userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
