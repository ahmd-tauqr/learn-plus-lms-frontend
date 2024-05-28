import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const response = await axios.post('http://localhost:3000/auth/signup', {
      username,
      password,
    });

    if (response.status === 201) {
      return NextResponse.json({ message: 'Signup successful' });
    } else {
      throw new Error(response.data.message || 'Signup failed');
    }
  } catch (error) {
    console.error('Error during sign-up:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
