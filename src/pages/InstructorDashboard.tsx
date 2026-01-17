import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnrollmentRequestCard from '@/components/enrollment/EnrollmentRequestCard';
import { mockEnrollmentRequests } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnrollmentRequest } from '@/types';

const InstructorDashboard = () => {
  const [requests, setRequests] = useState<EnrollmentRequest[]>(mockEnrollmentRequests);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const pendingRequests = requests.filter(r => r.status === 'pending_instructor');
  const approvedRequests = requests.filter(r => r.instructorApproval === true);
  const rejectedRequests = requests.filter(r => r.status === 'rejected' && r.instructorApproval === false);

  const handleApprove = async (requestId: string, remarks: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'pending_advisor' as const,
              instructorApproval: true,
              instructorRemarks: remarks || 'Approved by instructor',
              updatedAt: new Date(),
            }
          : r
      )
    );
    
    toast({
      title: 'Request Approved',
      description: 'The enrollment request has been forwarded to the branch advisor.',
    });
    setIsProcessing(false);
  };

  const handleReject = async (requestId: string, remarks: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected' as const,
              instructorApproval: false,
              instructorRemarks: remarks || 'Rejected by instructor',
              updatedAt: new Date(),
            }
          : r
      )
    );
    
    toast({
      title: 'Request Rejected',
      description: 'The enrollment request has been rejected.',
      variant: 'destructive',
    });
    setIsProcessing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Review and approve student enrollment requests
            </p>
          </div>
          <div className="flex gap-4">
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
            <Card className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedRequests.length}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="pending" className="gap-2">
              <Inbox className="h-4 w-4 hidden sm:block" />
              Pending
              {pendingRequests.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-pending text-pending-foreground text-xs">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4 hidden sm:block" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4 hidden sm:block" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 animate-fade-in">
            {pendingRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending requests at the moment.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingRequests.map(request => (
                  <EnrollmentRequestCard
                    key={request.id}
                    request={request}
                    userRole="instructor"
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 animate-fade-in">
            {approvedRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No approved requests yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {approvedRequests.map(request => (
                  <EnrollmentRequestCard
                    key={request.id}
                    request={request}
                    userRole="instructor"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 animate-fade-in">
            {rejectedRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No rejected requests.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {rejectedRequests.map(request => (
                  <EnrollmentRequestCard
                    key={request.id}
                    request={request}
                    userRole="instructor"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
