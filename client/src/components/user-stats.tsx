import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, DollarSign, Flame } from "lucide-react";

export function UserStats() {
  const { user } = useAuth();

  if (!user) return null;

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "bg-purple-500";
    if (streak >= 14) return "bg-blue-500";
    if (streak >= 7) return "bg-green-500";
    if (streak >= 3) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getStreakText = (streak: number) => {
    if (streak >= 30) return "Legendary";
    if (streak >= 14) return "Amazing";
    if (streak >= 7) return "Great";
    if (streak >= 3) return "Good";
    return "Starting";
  };

  const joinedDate = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle className="text-2xl text-teal-800">
            Welcome back, {user.firstName || user.username}! 👋
          </CardTitle>
          <p className="text-teal-600">
            You've been practicing mindful shopping since {joinedDate}
          </p>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Money Saved */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(user.totalMoneySaved || 0)}
                </p>
                <p className="text-sm text-green-600">Total Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-orange-600" />
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-orange-800">
                    {user.currentStreak || 0}
                  </p>
                  <Badge className={`${getStreakColor(user.currentStreak || 0)} text-white`}>
                    {getStreakText(user.currentStreak || 0)}
                  </Badge>
                </div>
                <p className="text-sm text-orange-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Longest Streak */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-800">
                  {user.longestStreak || 0}
                </p>
                <p className="text-sm text-purple-600">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Visits */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-800">
                  {user.totalVisits || 0}
                </p>
                <p className="text-sm text-blue-600">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivation Message */}
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                {user.currentStreak === 0 ? "Start Your Journey" : 
                 user.currentStreak === 1 ? "Great Start!" :
                 user.currentStreak < 7 ? "Building Momentum" :
                 user.currentStreak < 14 ? "Fantastic Progress!" :
                 user.currentStreak < 30 ? "You're on Fire!" :
                 "Mindful Shopping Master!"}
              </h3>
              <p className="text-yellow-700">
                {user.currentStreak === 0 ? "Visit daily to start building your mindful shopping habit." :
                 user.currentStreak === 1 ? "You've taken the first step! Come back tomorrow to continue." :
                 user.currentStreak < 7 ? "Keep visiting daily to strengthen your mindful shopping practice." :
                 user.currentStreak < 14 ? "You're developing a strong habit! Keep it up!" :
                 user.currentStreak < 30 ? "Your consistency is paying off! You're becoming a mindful shopper." :
                 "You've mastered the art of mindful shopping! You're an inspiration to others."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}