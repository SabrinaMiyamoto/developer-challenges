import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth-guard'
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard) 
  @Post('login')
  @HttpCode(HttpStatus.OK) 
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {

    
    return this.authService.login(req.user); 
  }
}