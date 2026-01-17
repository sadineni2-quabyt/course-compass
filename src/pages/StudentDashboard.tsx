import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CourseCard from '@/components/courses/CourseCard';
import { mockCourses, mockEnrollmentRequests } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, CheckCircle, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['course-3']);
  const [pendingRequests, setPendingRequests] = useState<string[]>(['course-1']);
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEnroll = async (courseId: string) => {
    setIsEnrolling(courseId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPendingRequests(prev => [...prev, courseId]);
    setIsEnrolling(null);
    
    const course = mockCourses.find(c => c.id === courseId);
    toast({
      title: 'Enrollment Request Sent!',
      description: `Your request for ${course?.name} has been sent to the instructor for approval.`,
    });
  };

  const availableCourses = mockCourses.filter(
    c => !enrolledCourses.includes(c.id) && !pendingRequests.includes(c.id)
  );

  const myEnrolledCourses = mockCourses.filter(c => enrolledCourses.includes(c.id));
  const myPendingCourses = mockCourses.filter(c => pendingRequests.includes(c.id));

  // Mock enrollment history
  const enrollmentHistory = mockEnrollmentRequests.filter(r => r.studentId === 'student-1');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Student Dashboard
            </h1>
            <p className="text-muted-foreground">
              Browse available courses and track your enrollment status
            </p>
          </div>
          <div className="flex gap-4">
            <Card className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </div>
              </div>
            </Card>
            <Card className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-pending/10">
                  <Clock className="h-5 w-5 text-pending" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="available" className="gap-2">
              <BookOpen className="h-4 w-4 hidden sm:block" />
              Available
            </TabsTrigger>
            <TabsTrigger value="enrolled" className="gap-2">
              <CheckCircle className="h-4 w-4 hidden sm:block" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4 hidden sm:block" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Courses Open for Enrollment
            </h2>
            {availableCourses.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No courses available for enrollment at this time.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    isEnrolling={isEnrolling === course.id}
                    showEnrollButton={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-6 animate-fade-in">
            {/* Enrolled Courses */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Enrolled Courses
              </h2>
              {myEnrolledCourses.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myEnrolledCourses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      showEnrollButton={false}
                      isEnrolled={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pending Requests */}
            {myPendingCourses.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-pending" />
                  Pending Approval
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myPendingCourses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      showEnrollButton={false}
                      isPending={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enrollment History</CardTitle>
                <CardDescription>Track all your enrollment requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrollmentHistory.map(request => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/50 gap-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{request.courseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.courseCode} • {request.instructorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested: {format(request.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'status-approved'
                            : request.status === 'rejected'
                            ? 'status-rejected'
                            : 'status-pending'
                        }
                      >
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
