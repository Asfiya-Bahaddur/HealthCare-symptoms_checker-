import { motion } from 'motion/react';
import { HeartPulse, Shield, Clock, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FloatingDNA } from './FloatingDNA';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 flex items-center justify-between px-8 py-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <HeartPulse className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HealthAI
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onGetStarted} variant="outline" className="group">
            Sign In
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">AI-Powered Health Assistant</span>
            </motion.div>

            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Your Health,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Get instant, AI-powered health insights from your symptoms. Track your health journey with intelligent suggestions and personalized care recommendations.
            </p>

            <div className="flex gap-4">
              <Button onClick={onGetStarted} size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-12"
            >
              <div>
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Symptoms Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">95%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* 3D DNA Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <FloatingDNA />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose HealthAI?</h2>
          <p className="text-xl text-gray-600">Advanced features for modern healthcare</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/80 backdrop-blur">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 container mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Three simple steps to better health</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 container mx-auto px-8 py-20"
      >
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of users making smarter health decisions every day</p>
          <Button onClick={onGetStarted} size="lg" variant="secondary" className="group">
            Start Your Free Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}

const features = [
  {
    icon: HeartPulse,
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze your symptoms to provide accurate health insights',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is encrypted and stored securely with enterprise-grade protection',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    icon: Clock,
    title: 'Instant Results',
    description: 'Get immediate suggestions and recommendations based on your symptoms',
    color: 'bg-gradient-to-br from-pink-500 to-pink-600'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your health journey with comprehensive history and analytics',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600'
  }
];

const steps = [
  {
    title: 'Sign Up',
    description: 'Create your free account in seconds with secure authentication'
  },
  {
    title: 'Enter Symptoms',
    description: 'Describe what you\'re experiencing with our intuitive interface'
  },
  {
    title: 'Get Insights',
    description: 'Receive AI-powered suggestions and track your health journey'
  }
];
