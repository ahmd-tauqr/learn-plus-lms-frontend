'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Nav() {
  const { isAuthenticated, logout } = useAuth();

  const handleSignout = () => {
    logout();
  };

  return (
    <div className='w-full bg-gray-800 text-white'>
      <nav className='container mx-auto p-4 flex justify-between items-center'>
        <Link href='/' className='text-3xl font-bold'>
          Learn Plus
        </Link>
        <div className='flex space-x-4'>
          <Link href='/courses' className='text-xl'>
            All Courses
          </Link>
          {isAuthenticated ? (
            <>
              <Link href='/enrollments' className='text-xl'>
                My Enrollments
              </Link>
              <button onClick={handleSignout} className='text-xl'>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href='/signup' className='text-xl'>
                Sign Up
              </Link>
              <Link href='/signin' className='text-xl'>
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
