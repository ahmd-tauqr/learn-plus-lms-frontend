import axios from 'axios';
import { cookies } from 'next/headers';

export async function signin(username: string, password: string) {
  try {
    const response = await axios.post(
      'http://localhost:3000/auth/signin',
      {
        username,
        password,
      },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader && setCookieHeader.length > 0) {
        const accessToken = setCookieHeader[0].split(';')[0].split('=')[1];
        cookies().set('accessToken', accessToken);
        return { message: 'Signin successful' };
      } else {
        throw new Error('Access token not found in the response headers');
      }
    } else {
      throw new Error(response.data.message || 'Signin failed');
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw new Error('Internal Server Error');
  }
}

export async function signup(username: string, password: string) {
  try {
    const response = await axios.post('http://localhost:3000/auth/signup', {
      username,
      password,
    });

    if (response.status === 200) {
      return { message: 'Signup successful' };
    } else {
      throw new Error(response.data.message || 'Signup failed');
    }
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw new Error('Internal Server Error');
  }
}
