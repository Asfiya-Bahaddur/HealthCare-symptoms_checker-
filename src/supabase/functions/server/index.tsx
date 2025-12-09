import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client with service role
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Sign up endpoint
app.post('/make-server-0c4f6f5c/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user with auto-confirmed email
    // Email is automatically confirmed since an email server hasn't been configured
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Sign up error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Analyze symptoms endpoint
app.post('/make-server-0c4f6f5c/analyze-symptoms', async (c) => {
  try {
    // Verify authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { symptoms, severity } = await c.req.json();

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return c.json({ error: 'Symptoms are required' }, 400);
    }

    // Generate AI suggestions based on symptoms and severity
    const suggestions = generateSuggestions(symptoms, severity);

    // Store in database
    const entryId = crypto.randomUUID();
    const entry = {
      id: entryId,
      userId: user.id,
      symptoms,
      suggestions,
      severity,
      timestamp: new Date().toISOString()
    };

    await kv.set(`symptom:${user.id}:${entryId}`, entry);

    return c.json({ suggestions, entryId });
  } catch (error) {
    console.log('Analyze symptoms error:', error);
    return c.json({ error: 'Failed to analyze symptoms' }, 500);
  }
});

// Get symptom history endpoint
app.get('/make-server-0c4f6f5c/symptom-history', async (c) => {
  try {
    // Verify authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all entries for this user
    const entries = await kv.getByPrefix(`symptom:${user.id}:`);
    
    // Sort by timestamp (newest first)
    const sortedEntries = entries.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ entries: sortedEntries });
  } catch (error) {
    console.log('Get symptom history error:', error);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// AI suggestion generator function
function generateSuggestions(symptoms: string[], severity: string): string[] {
  const suggestions: string[] = [];
  const symptomsLower = symptoms.map(s => s.toLowerCase());

  // General suggestions based on severity
  if (severity === 'severe') {
    suggestions.push('Consider seeking immediate medical attention if symptoms worsen or persist');
    suggestions.push('Contact your healthcare provider for a professional evaluation');
  } else if (severity === 'moderate') {
    suggestions.push('Monitor your symptoms and consult a healthcare provider if they worsen');
    suggestions.push('Keep track of symptom duration and any changes in intensity');
  } else {
    suggestions.push('Get adequate rest and monitor your symptoms');
    suggestions.push('Consider over-the-counter remedies if appropriate');
  }

  // Symptom-specific suggestions
  if (symptomsLower.some(s => s.includes('fever'))) {
    suggestions.push('Stay hydrated and monitor your temperature regularly');
    suggestions.push('Rest in a cool environment and consider fever-reducing medication');
  }

  if (symptomsLower.some(s => s.includes('headache'))) {
    suggestions.push('Ensure you\'re drinking enough water throughout the day');
    suggestions.push('Take breaks from screens and rest in a quiet, dark room');
  }

  if (symptomsLower.some(s => s.includes('cough') || s.includes('throat'))) {
    suggestions.push('Stay hydrated with warm liquids like tea or soup');
    suggestions.push('Consider using a humidifier to ease respiratory discomfort');
  }

  if (symptomsLower.some(s => s.includes('fatigue') || s.includes('tired'))) {
    suggestions.push('Prioritize sleep and maintain a regular sleep schedule');
    suggestions.push('Avoid strenuous activities and give your body time to recover');
  }

  if (symptomsLower.some(s => s.includes('nausea') || s.includes('stomach'))) {
    suggestions.push('Eat small, bland meals and avoid fatty or spicy foods');
    suggestions.push('Stay hydrated with small sips of water or clear fluids');
  }

  if (symptomsLower.some(s => s.includes('dizz'))) {
    suggestions.push('Avoid sudden movements and get up slowly from sitting or lying down');
    suggestions.push('Ensure you\'re eating regularly and staying hydrated');
  }

  // General wellness suggestions
  suggestions.push('Maintain a healthy diet rich in fruits and vegetables');
  suggestions.push('Practice good hygiene, including regular handwashing');
  
  // Ensure we have a good number of suggestions
  if (suggestions.length < 6) {
    suggestions.push('Get adequate sleep (7-9 hours per night)');
    suggestions.push('Avoid smoking and limit alcohol consumption');
    suggestions.push('Consider gentle exercise once you feel better, if appropriate');
  }

  return suggestions.slice(0, 8); // Return up to 8 suggestions
}

Deno.serve(app.fetch);
