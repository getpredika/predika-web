import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Home,
  Brain,
  Zap,
  Flame,
  Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { useQuizStats, useQuizHistory } from "@/hooks/use-quiz";

export default function ProgressDashboard() {
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuizStats();
  const { data: history, isLoading: isLoadingHistory, error: historyError } = useQuizHistory({ limit: 10 });

  const isLoading = isLoadingStats || isLoadingHistory;
  const error = statsError || historyError;

  // Debug: check what API returns
  console.log("Stats from API:", stats);
  console.log("History from API:", history);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getQuizTypeIcon = (quizType: string) => {
    switch (quizType) {
      case "listening_quiz": return <Brain className="w-4 h-4" />;
      case "definition_quiz": return <BookOpen className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getQuizTypeLabel = (quizType: string) => {
    switch (quizType) {
      case "listening_quiz": return "Listening";
      case "definition_quiz": return "Definition";
      default: return "Quiz";
    }
  };

  // Transform recent activity data for the chart
  const scoreData = stats?.recentActivity?.slice(0, 7).reverse().map((activity) => ({
    name: formatDate(activity.date),
    score: Math.round(activity.averageScore),
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0faf7] flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold mb-2">Unable to load progress</h2>
          <p className="text-muted-foreground mb-4">
            {(error as Error)?.message || "Please make sure you're logged in to view your progress."}
          </p>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </Card>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                    <p className="text-3xl font-bold" data-testid="text-quizzes-taken">{stats?.totalQuizzes || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                    <p className="text-3xl font-bold" data-testid="text-accuracy-rate">{Math.round(stats?.accuracyRate || 0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-3xl font-bold" data-testid="text-current-streak">{stats?.currentStreak || 0}</p>
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
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Score</p>
                    <p className="text-3xl font-bold" data-testid="text-best-score">{Math.round(stats?.bestScore || 0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mb-8">
          <Card className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5" />
                Quiz Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats?.totalQuestionsAnswered || 0}</p>
                    <p className="text-primary-foreground/80 text-sm">Questions Answered</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats?.totalCorrectAnswers || 0}</p>
                    <p className="text-primary-foreground/80 text-sm">Correct Answers</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{Math.round(stats?.averageTimePerQuestion || 0)}s</p>
                    <p className="text-primary-foreground/80 text-sm">Avg Time/Question</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats?.longestStreak || 0}</p>
                    <p className="text-primary-foreground/80 text-sm">Longest Streak</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
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
                  Daily Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.recentActivity.slice(0, 7).reverse().map(a => ({
                      name: formatDate(a.date),
                      quizzes: a.quizzesCompleted,
                    }))}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                        formatter={(value: number) => [value, "Quizzes"]}
                      />
                      <Bar dataKey="quizzes" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <p>Complete quizzes to see your activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Quiz History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Quiz History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history && history.length > 0 ? (
                <div className="space-y-3">
                  {history.slice(0, 5).map((attempt) => (
                    <div
                      key={attempt.sessionId}
                      className="flex items-center justify-between p-3 rounded-lg bg-stone-50"
                      data-testid={`activity-${attempt.sessionId}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getQuizTypeIcon(attempt.quizType)}
                        </div>
                        <div>
                          <p className="font-medium">{getQuizTypeLabel(attempt.quizType)} Quiz</p>
                          <p className="text-sm text-muted-foreground">{formatDate(attempt.completedAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{attempt.correctAnswers}/{attempt.totalQuestions}</p>
                        <Badge variant={attempt.scorePercentage >= 70 ? "default" : "secondary"}>
                          {Math.round(attempt.scorePercentage)}%
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
      </div>
    </div>
  );
}
