'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import slugify from 'slugify';
import { Course } from '@/types/entities';
import { notifyError, notifySuccess } from '@/components/Toaster';

const CoursesPage = () => {
  const { enrollToCourse, getEnrollments, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const enrollmentsData = await getEnrollments();
      setEnrollments(new Set(enrollmentsData.map((e) => e.course.id)));
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollToCourse(courseId);
      notifySuccess('Successfully enrolled');
      setEnrollments((prev) => new Set(prev).add(courseId));
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, enrollmentsCount: course.enrollmentsCount + 1 }
            : course
        )
      );
    } catch (error) {
      console.error('Error enrolling to course:', error);
      notifyError('Failed to enroll. Please try again later.');
    }
  };

  return (
    <div className='p-8'>
      <h1 className='text-center text-3xl font-bold mb-6'>Our Courses</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {courses.map((course) => (
          <div key={course.id} className='bg-white p-6 rounded shadow-md'>
            <h2 className='text-xl font-bold mb-2'>{course.title}</h2>
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
            <div className='flex justify-between'>
              <Link
                href={`/courses/${slugify(course.title, { lower: true })}`}
                className='inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'
              >
                View Details
              </Link>
              {isAuthenticated && !enrollments.has(course.id) && (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className='inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700'
                >
                  Enroll
                </button>
              )}
              {isAuthenticated && enrollments.has(course.id) && (
                <Link
                  href={`/enrollments/${slugify(course.title, {
                    lower: true,
                  })}`}
                  className='inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700'
                >
                  View Course
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
