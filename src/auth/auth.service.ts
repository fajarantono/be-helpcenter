import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  async verifyAuth(token: string): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.AUTH_SERVICE_URL}/security/check`,
        { token },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }
}
