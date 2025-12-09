import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SymptomCheckerProps {
  user: any;
  accessToken: string | null;
  onBack: () => void;
}

export function SymptomChecker({ user, accessToken, onBack }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea',
    'Dizziness', 'Sore throat', 'Body aches', 'Shortness of breath'
  ];

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0c4f6f5c/analyze-symptoms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            symptoms,
            severity
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      setShowResults(true);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms([]);
    setSeverity('moderate');
    setSuggestions([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Symptom Checker</h2>
              </div>

              {/* Symptom Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="symptom">Enter Your Symptoms</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="symptom"
                      value={currentSymptom}
                      onChange={(e) => setCurrentSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                      placeholder="e.g., Headache"
                    />
                    <Button onClick={addSymptom} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Common Symptoms */}
                <div>
                  <Label>Quick Add</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant={symptoms.includes(symptom) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          if (symptoms.includes(symptom)) {
                            removeSymptom(symptom);
                          } else {
                            setSymptoms([...symptoms, symptom]);
                          }
                        }}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Added Symptoms */}
                {symptoms.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Label>Selected Symptoms ({symptoms.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-blue-50 rounded-lg">
                      {symptoms.map((symptom) => (
                        <Badge key={symptom} className="gap-2">
                          {symptom}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeSymptom(symptom)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Severity */}
                <div>
                  <Label>Severity Level</Label>
                  <RadioGroup value={severity} onValueChange={setSeverity} className="mt-2">
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-green-300 transition-colors">
                      <RadioGroupItem value="mild" id="mild" />
                      <Label htmlFor="mild" className="flex-1 cursor-pointer">
                        <div className="font-medium">Mild</div>
                        <div className="text-sm text-gray-500">Manageable discomfort</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-yellow-300 transition-colors">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                        <div className="font-medium">Moderate</div>
                        <div className="text-sm text-gray-500">Noticeable impact on daily activities</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-red-300 transition-colors">
                      <RadioGroupItem value="severe" id="severe" />
                      <Label htmlFor="severe" className="flex-1 cursor-pointer">
                        <div className="font-medium">Severe</div>
                        <div className="text-sm text-gray-500">Significant distress or disruption</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button 
                onClick={handleAnalyze} 
                className="w-full" 
                size="lg"
                disabled={loading || symptoms.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-2xl font-bold mb-6">AI Suggestions</h2>

              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[400px] text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                      <Sparkles className="w-12 h-12 text-blue-500" />
                    </div>
                    <p className="text-gray-500">
                      Enter your symptoms and click "Analyze Symptoms" to receive AI-powered health suggestions
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Warning Banner */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Important:</strong> These are AI-generated suggestions for informational purposes only. Please consult a healthcare professional for proper medical advice.
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <p className="text-gray-700">{suggestion}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleReset} variant="outline" className="flex-1">
                        Check Again
                      </Button>
                      <Button onClick={onBack} className="flex-1">
                        View History
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
