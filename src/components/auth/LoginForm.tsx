import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import OTPInput from './OTPInput';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith('.edu');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid college email address (.edu)');
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('otp');
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);
    setError('');
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any 6-digit OTP
    if (otp.length === 6) {
      onLogin(email);
    } else {
      setError('Invalid OTP. Please try again.');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 animate-scale-in">
      <CardHeader className="space-y-1 text-center pb-2">
        <CardTitle className="text-2xl font-heading font-bold text-foreground">
          {step === 'email' ? 'Sign In' : 'Verify OTP'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {step === 'email' 
            ? 'Enter your college email to receive a one-time password'
            : `We've sent a 6-digit code to ${email}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                College Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-destructive animate-fade-in">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-12" 
              variant="hero"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <OTPInput 
              length={6} 
              onComplete={handleOTPVerify}
              disabled={isLoading}
            />
            
            {error && (
              <p className="text-sm text-destructive text-center animate-fade-in">{error}</p>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button 
                variant="link" 
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-primary"
              >
                Resend OTP
              </Button>
            </div>

            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setStep('email')}
              disabled={isLoading}
            >
              Use a different email
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
