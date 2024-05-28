'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notifySuccess, notifyError } from '@/components/Toaster';
import axios from 'axios';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(true);
    try {
      const response = await axios.post('/api/signup', { username, password });

      if (response.status === 200) {
        notifySuccess(response.data.message);
        router.push('/signin');
      } else {
        notifyError('Signup failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        notifyError(
          error.response.data.message ||
            'Failed to sign up. Please try again later.'
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
        <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up</h2>
        <form onSubmit={handleSignup}>
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
              {isPending ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
          <div className='mt-4 text-center'>
            <p>Already have an account?</p>
            <Link className='text-blue-500 hover:text-blue-700' href='/signin'>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
