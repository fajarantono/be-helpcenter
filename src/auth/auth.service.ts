import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  async AuthLogin(account: string, password: string): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.AUTH_SERVICE_URL}/security/login`,
        { account, password },
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

  async AuthLoginByEmail(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.AUTH_SERVICE_URL}/security/loginByEmail`,
        { email, password },
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

  async AuthLoginByPhoneNumber(
    phoneNumber: number,
    password: string,
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.AUTH_SERVICE_URL}/security/loginByPhoneNumber`,
        { phoneNumber, password },
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
