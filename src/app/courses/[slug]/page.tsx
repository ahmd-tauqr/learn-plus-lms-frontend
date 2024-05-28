'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import slugify from 'slugify';
import { notifyError, notifySuccess } from '@/components/Toaster';
import { Course } from '@/types/entities';
import Link from 'next/link';

export default function CourseDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { enrollToCourse, getEnrollments, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  useEffect(() => {
    if (isAuthenticated && course) {
      fetchEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, course]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/courses`);
      const courseData = response.data.find(
        (c: any) => slugify(c.title, { lower: true }) === params.slug
      );
      if (courseData) {
        setCourse(courseData);
      } else {
        console.error('Course not found');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const enrollments = await getEnrollments();
      const isAlreadyEnrolled = enrollments.some(
        (e) => e.course.id === course!.id
      );
      setIsEnrolled(isAlreadyEnrolled);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      if (course) {
        await enrollToCourse(course.id);
        notifySuccess('Successfully enrolled');
        setIsEnrolled(true);
        setCourse((prev) =>
          prev ? { ...prev, enrollmentsCount: prev.enrollmentsCount + 1 } : prev
        );
      }
    } catch (error) {
      console.error('Error enrolling to course:', error);
      notifyError('Failed to enroll. Please try again later.');
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>{course.title}</h1>
      <p className='text-gray-700 mb-4'>{course.description}</p>
      <div className='flex flex-wrap gap-2 mb-4'>
        {course.tags.map((tag) => (
          <span
            key={tag}
            className='bg-gray-200 text-gray-800 text-sm font-medium px-2 py-1 rounded'
          >
            {tag}
          </span>
        ))}
      </div>
      <p className='text-gray-500 mb-4'>
        Enrollments: {course.enrollmentsCount}
      </p>
      <h2 className='text-2xl font-bold mb-2'>Lessons</h2>
      <ul className='list-disc pl-6'>
        {course.lessons.map((lesson) => (
          <li key={lesson.id} className='mb-2'>
            {lesson.title} -{' '}
            <span className='text-gray-500'>{lesson.status}</span>
          </li>
        ))}
      </ul>
      {isAuthenticated && !isEnrolled && (
        <button
          onClick={handleEnroll}
          className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'
        >
          Enroll
        </button>
      )}
      {isAuthenticated && isEnrolled && (
        <Link
          href={`/enrollments/${slugify(course.title, { lower: true })}`}
          className='mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700'
        >
          View Course
        </Link>
      )}
    </div>
  );
}
