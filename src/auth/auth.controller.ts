// import { Body, Post, Controller } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { AuthService } from './auth.service';

// @Controller({
//   path: 'auth',
//   version: '1',
// })
// @ApiTags('Auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) { }

//   @Post('login')
//   loginByEmail(
//     @Body() credentials: { email: string; password: string },
//   ): Promise<any> {
//     return this.authService.login(credentials.email, credentials.password);
//   }
// }
