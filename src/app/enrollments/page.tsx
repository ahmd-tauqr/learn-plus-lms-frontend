'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Enrollment } from '@/types/entities';
import slugify from 'slugify';
import { notifyError, notifySuccess } from '@/components/Toaster';

export default function EnrollmentsPage() {
  const { getEnrollments, unenrollFromCourse } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const enrollments = await getEnrollments();
      setEnrollments(enrollments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    try {
      await unenrollFromCourse(enrollmentId);
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
      notifySuccess('Successfully unenrolled');
    } catch (error) {
      console.error('Error unenrolling:', error);
      notifyError('Failed to unenroll. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-8'>
      <h1 className='text-center text-3xl font-bold mb-6'>My Enrollments</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {enrollments.map((enrollment) => {
          const slug = slugify(enrollment.course.title, { lower: true });
          return (
            <div key={enrollment.id} className='bg-white p-6 rounded shadow-md'>
              <h2 className='text-xl font-bold mb-2'>
                {enrollment.course.title}
              </h2>
              <p className='text-gray-700 mb-4'>
                {enrollment.course.description}
              </p>
              <div className='flex flex-wrap gap-2 mb-4'>
                {enrollment.course.tags.map((tag) => (
                  <span
                    key={tag}
                    className='bg-gray-200 text-gray-800 text-sm font-medium px-2 py-1 rounded'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className='text-gray-500 mb-4'>
                Progress: {enrollment.progress}%
              </p>
              <p className='text-gray-500 mb-4'>Status: {enrollment.status}</p>
              <div className='flex justify-between'>
                <Link
                  href={`/enrollments/${slug}`}
                  className='inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleUnenroll(enrollment.id)}
                  className='inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700'
                >
                  Unenroll
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
