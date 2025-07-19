import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [amount, setAmount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setIsVerifying(false);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      if (data?.success) {
        setPaymentSuccess(true);
        setAmount(data.amount);
        toast({
          title: "Payment Successful!",
          description: `${data.amount} USDT has been added to your wallet`,
        });
      } else {
        setPaymentSuccess(false);
        toast({
          title: "Payment Verification Failed",
          description: "There was an issue verifying your payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentSuccess(false);
      toast({
        title: "Verification Error",
        description: "Failed to verify payment status",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground text-center">
              Please wait while we confirm your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {paymentSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {paymentSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
          <CardDescription>
            {paymentSuccess 
              ? `${amount} USDT has been successfully added to your wallet`
              : 'There was an issue processing your payment'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleContinue} className="w-full" size="lg">
            Continue to Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;