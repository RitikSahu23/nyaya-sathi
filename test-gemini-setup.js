// Test script to verify Gemini API setup
import { generateGeminiResponse } from './api/gemini-handler.js';

async function testGeminiSetup() {
  console.log('🧪 Testing Gemini API setup...\n');
  
  // Test 1: No API key (should fallback to Ollama)
  console.log('Test 1: No Gemini API key (should use Ollama fallback)');
  try {
    const result1 = await generateGeminiResponse({
      userMessage: 'What is Section 420 of IPC?',
      language: 'english',
      selectedState: ''
    });
    console.log('✅ Success:', result1.status === 200 ? 'Ollama fallback working' : 'Failed');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: With API key (if available in environment)
  console.log('Test 2: With Gemini API key (if configured)');
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const result2 = await generateGeminiResponse({
        userMessage: 'What is cyber law in India?',
        language: 'english',
        selectedState: ''
      }, { apiKey });
      console.log('✅ Success:', result2.status === 200 ? 'Gemini API working' : 'Failed');
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  } else {
    console.log('⚠️  No Gemini API key found in environment');
    console.log('💡 To test Gemini API:');
    console.log('   1. Get API key from: https://aistudio.google.com/app/apikey');
    console.log('   2. Set GEMINI_API_KEY=your_key_here in .env.local');
    console.log('   3. Run this test again');
  }
  
  console.log('\n🎯 Priority System:');
  console.log('   1. Gemini API (if API key available)');
  console.log('   2. Ollama (fallback if Gemini fails)');
  console.log('   3. Works in both local and production');
}

testGeminiSetup().catch(console.error);
