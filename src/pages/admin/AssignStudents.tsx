import { useState } from 'react';
import { useDataContext } from '../../context/DataContext';
import { ArrowRight, ArrowLeft, Search, Users } from 'lucide-react';

const AssignStudents = () => {
  const { courses, students, faculties } = useDataContext();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyAssignments, setFacultyAssignments] = useState<{[studentId: string]: string}>({});
  const [studentsPerFaculty, setStudentsPerFaculty] = useState(50);

  // Get enrolled students for selected course
  const enrolledStudents = selectedCourse 
    ? students.filter(student => student.courses.includes(selectedCourse))
    : [];

  // Filter students based on search
  const filteredStudents = enrolledStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAutoAssign = () => {
    const availableFaculty = faculties.filter(f => f.department === 
      courses.find(c => c.id === selectedCourse)?.department
    );

    if (!availableFaculty.length) return;

    const newAssignments = {...facultyAssignments};
    filteredStudents.forEach((student, index) => {
      const facultyIndex = Math.floor(index / studentsPerFaculty) % availableFaculty.length;
      newAssignments[student.id] = availableFaculty[facultyIndex].id;
    });

    setFacultyAssignments(newAssignments);
  };

  const handleManualAssign = (studentId: string, facultyId: string) => {
    setFacultyAssignments(prev => ({
      ...prev,
      [studentId]: facultyId
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assign Students to Faculty</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                Select Course
              </label>
              <select
                id="course"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <>
                <div>
                  <label htmlFor="studentsPerFaculty" className="block text-sm font-medium text-gray-700">
                    Students per Faculty
                  </label>
                  <input
                    type="number"
                    id="studentsPerFaculty"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={studentsPerFaculty}
                    onChange={(e) => setStudentsPerFaculty(parseInt(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAutoAssign}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Auto Assign
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedCourse && (
          <div className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Enrolled Students</h3>
                <div className="space-y-2">
                  {filteredStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.id}</p>
                      </div>
                      <select
                        value={facultyAssignments[student.id] || ''}
                        onChange={(e) => handleManualAssign(student.id, e.target.value)}
                        className="ml-4 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Assign Faculty</option>
                        {faculties.map(faculty => (
                          <option key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Faculty Assignments</h3>
                <div className="space-y-4">
                  {faculties.map(faculty => {
                    const assignedStudents = filteredStudents.filter(
                      student => facultyAssignments[student.id] === faculty.id
                    );

                    return (
                      <div key={faculty.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">{faculty.name}</p>
                            <p className="text-sm text-gray-500">{faculty.department}</p>
                          </div>
                          <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                            <Users className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="text-sm text-blue-600">
                              {assignedStudents.length} students
                            </span>
                          </div>
                        </div>
                        {assignedStudents.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {assignedStudents.map(student => (
                              <div key={student.id} className="flex items-center justify-between py-1">
                                <span className="text-sm">{student.name}</span>
                                <button
                                  onClick={() => handleManualAssign(student.id, '')}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <ArrowLeft className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignStudents;