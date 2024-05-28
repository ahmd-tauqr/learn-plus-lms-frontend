'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Enrollment, EnrollmentStatus, LessonStatus } from '@/types/entities';
import { notifyError, notifySuccess } from '@/components/Toaster';
import slugify from 'slugify';

export default function EnrollmentDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const {
    getEnrollmentDetails,
    completeLessonProgress,
    unenrollFromCourse,
    getEnrollments,
  } = useAuth();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchEnrollmentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  const fetchEnrollmentDetails = async () => {
    try {
      const courseSlug = params.slug;
      const enrollments = await getEnrollments();
      const enrollmentData = enrollments.find(
        (e) => slugify(e.course.title, { lower: true }) === courseSlug
      );

      if (enrollmentData) {
        const enrollment = await getEnrollmentDetails(enrollmentData.id);
        setEnrollment(enrollment);
      } else {
        console.error('Enrollment not found for the provided slug');
      }
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
    }
  };

  const handleCompleteLesson = async (lessonId: string) => {
    try {
      await completeLessonProgress(enrollment!.id, lessonId);
      setEnrollment((prev) => {
        if (!prev) return null;
        const updatedLessonProgress = prev.lessonProgress.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, status: LessonStatus.COMPLETED }
            : lesson
        );

        const completedLessons = updatedLessonProgress.filter(
          (lesson) => lesson.status === LessonStatus.COMPLETED
        ).length;

        const totalLessons = updatedLessonProgress.length;
        const newProgress = Math.round((completedLessons / totalLessons) * 100);

        const newStatus =
          completedLessons === totalLessons
            ? EnrollmentStatus.COMPLETED
            : prev.status;

        return {
          ...prev,
          lessonProgress: updatedLessonProgress,
          progress: newProgress,
          status: newStatus,
        };
      });
      notifySuccess('Lesson marked as complete');
    } catch (error) {
      console.error('Error completing lesson progress:', error);
      notifyError('Failed to mark lesson as complete. Please try again later.');
    }
  };

  const handleUnenroll = async () => {
    try {
      await unenrollFromCourse(enrollment!.id);
      notifySuccess('Successfully unenrolled');
      router.push('/enrollments');
    } catch (error) {
      console.error('Error unenrolling:', error);
      notifyError('Failed to unenroll. Please try again later.');
    }
  };

  if (!enrollment) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>{enrollment.course.title}</h1>
      <p className='text-gray-700 mb-4'>{enrollment.course.description}</p>
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
        Enrollments: {enrollment.course.enrollmentsCount}
      </p>
      <p className='text-gray-500 mb-4'>Progress: {enrollment.progress}%</p>
      <p className='text-gray-500 mb-4'>Status: {enrollment.status}</p>
      <h2 className='text-2xl font-bold mb-2'>Lesson Progress</h2>
      <div className='flex flex-col space-y-4'>
        {enrollment.lessonProgress.map((lesson) => (
          <div key={lesson.id} className='flex justify-between items-center'>
            <span>
              {lesson.title} -{' '}
              <span className='text-gray-500'>{lesson.status}</span>
            </span>
            {lesson.status !== LessonStatus.COMPLETED && (
              <button
                onClick={() => handleCompleteLesson(lesson.id)}
                className='inline-block bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700'
              >
                Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleUnenroll}
        className='mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700'
      >
        Unenroll
      </button>
    </div>
  );
}
