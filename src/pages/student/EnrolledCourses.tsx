import { useState } from 'react';
import { BookOpen, Search, AlertCircle } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const { courses, removeStudentFromCourse } = useDataContext();
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  const [searchTerm, setSearchTerm] = useState('');

  // Get enrolled courses
  const enrolledCourses = courses.filter(course => 
    student.courses.includes(course.id) &&
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDrop = (courseId: string) => {
    if (confirm('Are you sure you want to drop this course?')) {
      removeStudentFromCourse(student.id, courseId);
    }
  };

  const handleViewDetails = (courseId: string) => {
    navigate(`/student/course/${courseId}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Enrolled Courses</h1>
        <p className="text-gray-600">Manage your course enrollments</p>
      </div>

      {enrolledCourses.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search enrolled courses..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Department:</span>
                    <span className="ml-2 text-sm text-gray-900">{course.department}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Faculty:</span>
                    <span className="ml-2 text-sm text-gray-900">{course.faculty}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Credits:</span>
                    <span className="ml-2 text-sm text-gray-900">{course.credits}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {course.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Semester {course.semester}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleViewDetails(course.id)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDrop(course.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Drop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-md p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No enrolled courses</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm 
                ? 'No enrolled courses match your search criteria' 
                : 'Browse available courses to enroll'}
            </p>
            <button
              onClick={() => navigate('/student/courses')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;