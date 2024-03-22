import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService], // Export AuthService so it can be used in other modules
})
export class AuthModule {}
