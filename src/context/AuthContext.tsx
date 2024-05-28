'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import axios from 'axios';
import { Enrollment, LessonStatus } from '@/types/entities';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getEnrollments: () => Promise<Enrollment[]>;
  getEnrollmentDetails: (enrollmentId: string) => Promise<Enrollment>;
  enrollToCourse: (courseId: string) => Promise<void>;
  unenrollFromCourse: (enrollmentId: string) => Promise<void>;
  completeLessonProgress: (
    enrollmentId: string,
    lessonId: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('accessToken') as string | undefined;
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 55 * 60 * 1000); // Refresh token every 55 minutes
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = getCookie('refreshToken') as string | undefined;
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCookie('accessToken', response.data.accessToken);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  const login = () => {
    const token = getCookie('accessToken') as string | undefined;
    if (token) {
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    deleteCookie('accessToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  const getEnrollments = async (): Promise<Enrollment[]> => {
    const token = getCookie('accessToken') as string | undefined;
    if (!token) {
      throw new Error('No access token available');
    }
    try {
      const response = await axios.get(`${API_URL}/auth/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  };

  const getEnrollmentDetails = async (
    enrollmentId: string
  ): Promise<Enrollment> => {
    const token = getCookie('accessToken') as string | undefined;
    if (!token) {
      throw new Error('No access token available');
    }
    try {
      const response = await axios.get(
        `${API_URL}/auth/enrollments/${enrollmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
      throw error;
    }
  };

  const enrollToCourse = async (courseId: string): Promise<void> => {
    const token = getCookie('accessToken') as string | undefined;
    if (!token) {
      throw new Error('No access token available');
    }
    try {
      await axios.post(
        `${API_URL}/auth/enroll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error enrolling to course:', error);
      throw error;
    }
  };

  const unenrollFromCourse = async (enrollmentId: string): Promise<void> => {
    const token = getCookie('accessToken') as string | undefined;
    if (!token) {
      throw new Error('No access token available');
    }
    try {
      await axios.delete(`${API_URL}/auth/unenroll/${enrollmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      throw error;
    }
  };

  const completeLessonProgress = async (
    enrollmentId: string,
    lessonId: string
  ): Promise<void> => {
    const token = getCookie('accessToken') as string | undefined;
    if (!token) {
      throw new Error('No access token available');
    }
    try {
      await axios.patch(
        `${API_URL}/auth/enrollments/${enrollmentId}/lessons/${lessonId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error completing lesson progress:', error);
      throw error;
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        getEnrollments,
        getEnrollmentDetails,
        enrollToCourse,
        unenrollFromCourse,
        completeLessonProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
