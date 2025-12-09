import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  HeartPulse, 
  LogOut, 
  Activity, 
  Calendar, 
  TrendingUp,
  Sparkles,
  Clock,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DashboardProps {
  user: any;
  accessToken: string | null;
  onLogout: () => void;
  onStartChecker: () => void;
}

interface SymptomEntry {
  id: string;
  symptoms: string[];
  suggestions: string[];
  severity: string;
  timestamp: string;
}

export function Dashboard({ user, accessToken, onLogout, onStartChecker }: DashboardProps) {
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0c4f6f5c/symptom-history`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'severe':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.user_metadata?.name || user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <Activity className="w-8 h-8 mb-2 opacity-80" />
              <div className="text-3xl font-bold">{entries.length}</div>
              <div className="text-sm opacity-90">Total Checks</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <Calendar className="w-8 h-8 mb-2 opacity-80" />
              <div className="text-3xl font-bold">
                {entries.filter(e => {
                  const date = new Date(e.timestamp);
                  const today = new Date();
                  return date.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className="text-sm opacity-90">Today</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
              <div className="text-3xl font-bold">
                {entries.filter(e => e.severity.toLowerCase() === 'mild').length}
              </div>
              <div className="text-sm opacity-90">Mild Cases</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <Sparkles className="w-8 h-8 mb-2 opacity-80" />
              <div className="text-3xl font-bold">AI</div>
              <div className="text-sm opacity-90">Powered</div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button onClick={onStartChecker} className="w-full justify-start group" size="lg">
                <Activity className="w-5 h-5 mr-3" />
                New Symptom Check
                <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Calendar className="w-5 h-5 mr-3" />
                View Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <TrendingUp className="w-5 h-5 mr-3" />
                Health Insights
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent History</h2>
            
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No symptom checks yet</p>
                <Button onClick={onStartChecker}>Start Your First Check</Button>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <Badge className={getSeverityColor(entry.severity)}>
                            {entry.severity}
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Symptoms:</div>
                          <div className="flex flex-wrap gap-2">
                            {entry.symptoms.map((symptom, i) => (
                              <Badge key={i} variant="secondary">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Suggestions:</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {entry.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
