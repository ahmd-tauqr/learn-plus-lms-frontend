import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const { username, password } = await req.json();

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
        const res = NextResponse.json({ message: 'Signin successful' });
        res.cookies.set('accessToken', accessToken);
        return res;
      } else {
        throw new Error('Access token not found in the response headers');
      }
    } else {
      throw new Error(response.data.message || 'Signin failed');
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
