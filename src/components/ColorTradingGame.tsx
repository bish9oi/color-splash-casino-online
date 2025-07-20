import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Coins, 
  LogOut, 
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  username: string;
}

interface ColorTradingGameProps {
  user: User;
  onLogout: () => void;
}

interface GameResult {
  userChoice: string;
  winningColor: string;
  isWin: boolean;
  timestamp: Date;
}

const COLORS = [
  { name: 'red', label: 'Electric Red', variant: 'game-red' as const },
  { name: 'blue', label: 'Neon Blue', variant: 'game-blue' as const },
  { name: 'yellow', label: 'Golden Thunder', variant: 'game-yellow' as const }
];

export function ColorTradingGame({ user, onLogout }: ColorTradingGameProps) {
  const [balance, setBalance] = useState(1000); // Default balance
  const [betAmount, setBetAmount] = useState(10);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [winStreak, setWinStreak] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);

  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isPlaying) {
      revealResult();
    }
    return () => clearInterval(interval);
  }, [countdown, isPlaying]);

  const placeBet = (color: string) => {
    if (balance < betAmount || isPlaying) return;

    setSelectedColor(color);
    setBalance(prev => prev - betAmount);
    setIsPlaying(true);
    setCountdown(3);
    setGameResult(null);
  };

  const revealResult = () => {
    const winningColor = COLORS[Math.floor(Math.random() * COLORS.length)].name;
    const isWin = selectedColor === winningColor;
    const winAmount = isWin ? betAmount * 2 : 0;
    
    if (isWin) {
      setBalance(prev => prev + winAmount);
      setTotalWins(prev => prev + 1);
      setWinStreak(prev => prev + 1);
    } else {
      setWinStreak(0);
    }

    const result: GameResult = {
      userChoice: selectedColor!,
      winningColor,
      isWin,
      timestamp: new Date()
    };

    setGameResult(result);
    setGameHistory(prev => [result, ...prev.slice(0, 9)]);
    setTotalGames(prev => prev + 1);
    setIsPlaying(false);
    setSelectedColor(null);
  };

  const quickBetAmounts = [10, 25, 50, 100];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-8 w-8 text-primary animate-float" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Color Splash Casino</h1>
              <p className="text-muted-foreground">Welcome back, {user.username}!</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Coins className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{balance.toFixed(2)} USDT</div>
              <div className="text-sm text-muted-foreground">Balance</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{winStreak}</div>
              <div className="text-sm text-muted-foreground">Win Streak</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{totalGames}</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bet Controls */}
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-neon">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Place Your Bet
              </CardTitle>
              <CardDescription>Choose your bet amount and select a color</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Bet Amount: {betAmount} USDT</span>
                  <span className="text-sm text-muted-foreground">Max: {balance.toFixed(2)} USDT</span>
                </div>
                <Progress value={balance > 0 ? (betAmount / balance) * 100 : 0} className="h-2" />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {quickBetAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant={betAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBetAmount(amount)}
                    disabled={amount > balance || isPlaying}
                  >
                    {amount} USDT
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game Display */}
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-neon">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">
                {countdown > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-8 w-8 animate-pulse" />
                    {countdown}
                  </div>
                ) : gameResult ? (
                  gameResult.isWin ? "🎉 YOU WIN! 🎉" : "😔 You Lost"
                ) : (
                  "Choose Your Color"
                )}
              </CardTitle>
              {gameResult && (
                <CardDescription className="text-lg">
                  {gameResult.isWin 
                    ? `The winning color was ${COLORS.find(c => c.name === gameResult.winningColor)?.label}! You won ${betAmount * 2} USDT!`
                    : `The winning color was ${COLORS.find(c => c.name === gameResult.winningColor)?.label}. Better luck next time!`
                  }
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Color Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {COLORS.map(color => (
                  <Button
                    key={color.name}
                    variant={color.variant}
                    size="lg"
                    className={cn(
                      "h-24 text-lg font-bold transition-all duration-300",
                      selectedColor === color.name && "ring-4 ring-primary",
                      gameResult?.winningColor === color.name && "animate-win-celebration",
                      gameResult && gameResult.winningColor !== color.name && gameResult.userChoice === color.name && "animate-lose-shake"
                    )}
                    onClick={() => placeBet(color.name)}
                    disabled={balance < betAmount || isPlaying}
                  >
                    {color.label}
                    <br />
                    <span className="text-sm opacity-75">{betAmount} USDT → {betAmount * 2} USDT</span>
                  </Button>
                ))}
              </div>

              {/* Winning Color Display */}
              {(countdown > 0 || gameResult) && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary mx-auto mb-4">
                    {countdown > 0 ? (
                      <div className="text-4xl font-bold animate-pulse">?</div>
                    ) : gameResult && (
                      <div className={cn(
                        "w-24 h-24 rounded-full",
                        gameResult.winningColor === 'red' && "bg-game-red shadow-game-red",
                        gameResult.winningColor === 'blue' && "bg-game-blue shadow-game-blue",
                        gameResult.winningColor === 'yellow' && "bg-game-yellow shadow-game-yellow",
                        gameResult.isWin && "animate-win-celebration"
                      )} />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Game History & Stats */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No games played yet</p>
                ) : (
                  gameHistory.map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 rounded-full",
                          game.userChoice === 'red' && "bg-game-red",
                          game.userChoice === 'blue' && "bg-game-blue",
                          game.userChoice === 'yellow' && "bg-game-yellow"
                        )} />
                        <span className="text-sm">→</span>
                        <div className={cn(
                          "w-4 h-4 rounded-full",
                          game.winningColor === 'red' && "bg-game-red",
                          game.winningColor === 'blue' && "bg-game-blue",
                          game.winningColor === 'yellow' && "bg-game-yellow"
                        )} />
                      </div>
                      <Badge variant={game.isWin ? "default" : "destructive"}>
                        {game.isWin ? "WIN" : "LOSS"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle>Game Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Choose a color and place your bet</p>
              <p>• A random color will be revealed after 3 seconds</p>
              <p>• If your color matches, you win 2x your bet!</p>
              <p>• If it doesn't match, you lose your bet</p>
              <p>• Build winning streaks for extra excitement!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}