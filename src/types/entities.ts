export enum LessonStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum EnrollmentStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Lesson {
  id: string;
  title: string;
  status: LessonStatus;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  enrollmentsCount: number;
  lessons: Lesson[];
}

export interface Enrollment {
  id: string;
  course: Course;
  lessonProgress: LessonProgress[];
  progress: number;
  status: EnrollmentStatus;
}

export interface LessonProgress {
  id: string;
  title: string;
  status: LessonStatus;
}
