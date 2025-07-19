import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, History, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface WalletProps {
  user: {
    email: string;
    username: string;
  };
  onBalanceUpdate?: (balance: number) => void;
}

export const WalletComponent = ({ user, onBalanceUpdate }: WalletProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Get wallet balance
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .single();

      if (wallet) {
        setBalance(parseFloat(wallet.balance));
        onBalanceUpdate?.(parseFloat(wallet.balance));
      }

      // Get recent transactions
      const { data: txns, error: txnError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (txns) {
        setTransactions(txns);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const handleAddFunds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount: 10 }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to payment",
          description: "Complete your payment to add 10 USDT to your wallet",
        });
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} USDT`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'bet':
        return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'win':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          USDT Wallet
        </CardTitle>
        <CardDescription>
          Manage your casino balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(balance)}</p>
        </div>

        <Button 
          onClick={handleAddFunds} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isLoading ? 'Processing...' : 'Add 10 USDT'}
        </Button>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <History className="h-4 w-4" />
            Recent Transactions
          </h4>
          {transactions.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(txn.type)}
                    <span className="text-sm capitalize">{txn.type}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      txn.type === 'deposit' || txn.type === 'win' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {txn.type === 'deposit' || txn.type === 'win' ? '+' : '-'}
                      {formatCurrency(parseFloat(txn.amount))}
                    </p>
                    <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'}>
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No transactions yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};