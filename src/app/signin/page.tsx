'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { notifySuccess, notifyError } from '@/components/Toaster';
import axios from 'axios';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(true);
    try {
      const response = await axios.post('/api/signin', { username, password });

      if (response.status === 200) {
        notifySuccess(response.data.message);
        login(); // Update context state
        router.push('/');
      } else {
        notifyError('Signin failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        notifyError(
          error.response.data.message ||
            'Failed to sign in. Please try again later.'
        );
      } else {
        notifyError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      startTransition(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-[30rem]'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Sign In</h2>
        <form onSubmit={handleSignin}>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='username'
            >
              Username
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='username'
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              placeholder='******************'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='flex items-center justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='submit'
              disabled={isPending}
            >
              {isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          <div className='mt-4 text-center'>
            <p>New here?</p>
            <Link className='text-blue-500 hover:text-blue-700' href='/signup'>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
