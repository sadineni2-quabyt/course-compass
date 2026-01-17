import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import LoginForm from '@/components/auth/LoginForm';
import RoleSelector from '@/components/auth/RoleSelector';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, UserCheck, Shield, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { setDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (role: UserRole) => {
    setDemoUser(role);
    navigate('/dashboard');
  };

  const handleEmailLogin = (email: string) => {
    // For demo, determine role from email
    if (email.includes('admin')) {
      setDemoUser('admin');
    } else if (email.includes('prof') || email.includes('dr')) {
      setDemoUser('instructor');
    } else if (email.includes('advisor')) {
      setDemoUser('advisor');
    } else {
      setDemoUser('student');
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur">
                <GraduationCap className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              micro-AIMS
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Academic Information Management System - Streamlined course enrollment 
              with instructor and advisor approvals
            </p>
            
            {/* Feature Icons */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="flex flex-col items-center gap-2 text-primary-foreground/80">
                <div className="p-3 rounded-full bg-primary-foreground/10">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="text-sm">Browse Courses</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-primary-foreground/80">
                <div className="p-3 rounded-full bg-primary-foreground/10">
                  <UserCheck className="h-6 w-6" />
                </div>
                <span className="text-sm">Easy Approval</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-primary-foreground/80">
                <div className="p-3 rounded-full bg-primary-foreground/10">
                  <Shield className="h-6 w-6" />
                </div>
                <span className="text-sm">Secure Access</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="h-16 bg-background" style={{
          clipPath: 'ellipse(70% 100% at 50% 100%)',
          marginTop: '-4rem',
        }} />
      </div>

      {/* Login Section */}
      <div className="container px-4 py-12 -mt-8">
        {showLogin ? (
          <div className="space-y-4">
            <LoginForm onLogin={handleEmailLogin} />
            <div className="text-center">
              <Button variant="ghost" onClick={() => setShowLogin(false)}>
                ← Back to role selection
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <RoleSelector onSelectRole={handleDemoLogin} />
            
            <div className="text-center space-y-4">
              <div className="flex items-center gap-4 justify-center">
                <div className="h-px bg-border flex-1 max-w-24" />
                <span className="text-sm text-muted-foreground">or</span>
                <div className="h-px bg-border flex-1 max-w-24" />
              </div>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowLogin(true)}
                className="gap-2"
              >
                Sign in with College Email
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 micro-AIMS. Academic Information Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
