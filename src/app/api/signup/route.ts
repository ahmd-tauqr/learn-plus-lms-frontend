import { NextResponse } from 'next/server';
import axios from 'axios';
import { notifyError, notifySuccess } from '@/components/Toaster';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      username,
      password,
    });

    if (response.status === 201) {
      notifySuccess('Signup successful');
      return NextResponse.json({ message: 'Signup successful' });
    } else {
      notifyError(response.data.message || 'Signup failed');
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
