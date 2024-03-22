// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  providers: [AuthService],
  exports: [AuthService], // Export AuthService agar dapat digunakan di modul lain
})
export class AuthModule {}
