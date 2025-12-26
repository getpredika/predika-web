import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Home,
  Brain,
  Zap,
  Star,
  Mic,
  Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from "recharts";

interface ProgressStats {
  totalWordsLearned: number;
  totalQuizzesTaken: number;
  averageScore: number;
  recentAttempts: {
    id: number;
    mode: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
  }[];
  masteryDistribution: { level: number; count: number }[];
  pronunciationStats: {
    totalAttempts: number;
    averageScore: number;
    lastPractice: string | null;
  };
}

const masteryLabels = ["New", "Learning", "Familiar", "Proficient", "Expert", "Mastered"];
const masteryColors = ["#e5e7eb", "#fcd34d", "#a3e635", "#22d3ee", "#818cf8", "#10b981"];

export default function ProgressDashboard() {
  const { data: stats, isLoading } = useQuery<ProgressStats>({
    queryKey: ["/api/progress/stats"],
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "speed": return <Zap className="w-4 h-4" />;
      case "listening": return <Brain className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const scoreData = stats?.recentAttempts.slice(0, 7).reverse().map((a, i) => ({
    name: formatDate(a.completedAt),
    score: Math.round((a.score / a.totalQuestions) * 100),
  })) || [];

  const masteryData = stats?.masteryDistribution.map((d) => ({
    name: masteryLabels[d.level],
    count: d.count,
    fill: masteryColors[d.level],
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0faf7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0faf7] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-2">Progress Dashboard</h1>
          <p className="text-muted-foreground">Track your vocabulary learning journey</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Words Learned</p>
                    <p className="text-3xl font-bold" data-testid="text-words-learned">{stats?.totalWordsLearned || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                    <p className="text-3xl font-bold" data-testid="text-quizzes-taken">{stats?.totalQuizzesTaken || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold" data-testid="text-average-score">{stats?.averageScore || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mastery Level</p>
                    <p className="text-3xl font-bold" data-testid="text-mastery-level">
                      {stats?.masteryDistribution.filter(d => d.level >= 4).reduce((sum, d) => sum + d.count, 0) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mb-8">
          <Card className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mic className="w-5 h-5" />
                Pronunciation Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" />
                      <circle
                        cx="40" cy="40" r="35"
                        stroke="white"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={220}
                        strokeDashoffset={220 - (220 * (stats?.pronunciationStats?.averageScore || 0)) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{stats?.pronunciationStats?.averageScore || 0}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Average Score</p>
                    <p className="text-xs text-primary-foreground/60">/ 100</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats?.pronunciationStats?.totalAttempts || 0}</p>
                    <p className="text-primary-foreground/80 text-sm">Total Attempts</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {stats?.pronunciationStats?.lastPractice 
                        ? formatDate(stats.pronunciationStats.lastPractice)
                        : "No practice yet"}
                    </p>
                    <p className="text-primary-foreground/80 text-sm">Last Practice</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scoreData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={scoreData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                        formatter={(value: number) => [`${value}%`, "Score"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: "#10b981", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <p>Complete quizzes to see your score trend</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-primary" />
                  Mastery Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {masteryData.some(d => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={masteryData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                        formatter={(value: number) => [value, "Words"]}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {masteryData.map((entry, index) => (
                          <Bar key={index} dataKey="count" fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <p>Practice words to track your mastery</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentAttempts.slice(0, 5).map((attempt) => (
                    <div 
                      key={attempt.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-stone-50"
                      data-testid={`activity-${attempt.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getModeIcon(attempt.mode)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{attempt.mode} Quiz</p>
                          <p className="text-sm text-muted-foreground">{formatDate(attempt.completedAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{attempt.score}/{attempt.totalQuestions}</p>
                        <Badge variant={attempt.score / attempt.totalQuestions >= 0.7 ? "default" : "secondary"}>
                          {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No quiz attempts yet</p>
                  <p className="text-sm">Start practicing to track your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/app">
            <Button variant="outline" data-testid="button-back-home">
              <Home className="w-4 h-4 mr-2" />
              Dictionary
            </Button>
          </Link>
          <Link href="/quiz">
            <Button data-testid="button-start-quiz">
              <Brain className="w-4 h-4 mr-2" />
              Start Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
