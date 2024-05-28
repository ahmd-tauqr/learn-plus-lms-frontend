# Learn Plus LMS

## Overview

Learn Plus LMS is a learning management system built using Next.js 14 with the App Router feature. It includes features for user authentication, course management, and enrollment management. The application interacts with a backend service built using NestJS.

## Features

- User Authentication (Signup, Signin, and Signout)
- Course Management (View Courses, Course Details)
- Enrollment Management (Enroll to Courses, View Enrollments, Mark Lesson as Complete, Unenroll from Courses)
- Responsive Design using Tailwind CSS
- Toast Notifications for success and error messages

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ahmd-tauqr/learn-plus-lms-frontend.git
cd learn-plus-lms-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This URL should point to your backend API.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the application.

## How to Use

### Authentication

- **Signup**: Navigate to `/signup` and create a new account.
- **Signin**: Navigate to `/signin` and login with your credentials.
- **Signout**: Click on the "Sign Out" button in the navigation bar to log out.

### Courses

- **View Courses**: Navigate to `/courses` to view the list of available courses.
- **Course Details**: Click on "View Details" to see more information about a course.

### Enrollments

- **Enroll to a Course**: After signing in, click on the "Enroll" button on a course to enroll.
- **View Enrollments**: Navigate to `/enrollments` to view your enrolled courses.
- **View Enrollment Details**: Click on "View Course" from your enrollments list to see detailed progress.
- **Mark Lesson as Complete**: In the enrollment details, click "Mark Complete" to update your progress.
- **Unenroll**: In the enrollment details, click "Unenroll" to remove yourself from the course.

### Toast Notifications

Toast notifications are used to provide feedback for user actions such as enrollment, sign in, sign out, and error handling.

## Dependencies

- Next.js
- React
- Tailwind CSS
- Axios
- cookies-next

## Backend Setup

The backend is built using NestJS. Follow the setup instructions in the backend repository to get it running.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## Contact

For any questions or support, please open an issue on the GitHub repository or contact me at [ahmd.tauqr@gmail.com].

---

This README provides a comprehensive guide for setting up, running, and using the Learn Plus LMS application. Feel free to customize it further based on your specific needs and repository details.