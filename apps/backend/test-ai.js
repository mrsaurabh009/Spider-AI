require('dotenv').config({ path: '../../.env' });

console.log('🧪 Testing Spider AI Service...\n');

// Test Claude API connection
async function testClaudeAPI() {
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    
    console.log('📡 Testing Claude API connection...');
    console.log('API Key:', process.env.CLAUDE_API_KEY ? '✅ Found' : '❌ Missing');
    
    if (!process.env.CLAUDE_API_KEY) {
      console.log('❌ Claude API key not found. Please check your .env file.');
      return false;
    }
    
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    
    console.log('🤖 Sending test request to Claude...');
    
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hello! Please respond with a simple greeting to confirm the API is working.'
        }
      ]
    });
    
    console.log('✅ Claude API Response:', response.content[0].text);
    console.log('📊 Tokens used:', response.usage.input_tokens + response.usage.output_tokens);
    
    return true;
    
  } catch (error) {
    console.log('❌ Claude API Error:', error.message);
    return false;
  }
}

// Test code generation
async function testCodeGeneration() {
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    
    console.log('\n🎨 Testing code generation...');
    
    const prompt = `You are Spider AI, an expert full-stack developer. Generate a simple React component that displays "Hello from Spider AI!".

RESPONSE FORMAT:
Return only the React component code, nothing else.

REQUIREMENTS:
- Use functional component
- Include TypeScript
- Make it clean and simple`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const generatedCode = response.content[0].text;
    
    console.log('✅ Generated Code:');
    console.log('-------------------');
    console.log(generatedCode);
    console.log('-------------------');
    console.log('📊 Tokens used:', response.usage.input_tokens + response.usage.output_tokens);
    
    return true;
    
  } catch (error) {
    console.log('❌ Code Generation Error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Spider AI Tests...\n');
  
  const apiTest = await testClaudeAPI();
  if (!apiTest) {
    console.log('\n❌ API test failed. Stopping tests.');
    return;
  }
  
  const codeTest = await testCodeGeneration();
  
  console.log('\n📋 Test Summary:');
  console.log('API Connection:', apiTest ? '✅ PASS' : '❌ FAIL');
  console.log('Code Generation:', codeTest ? '✅ PASS' : '❌ FAIL');
  
  if (apiTest && codeTest) {
    console.log('\n🎉 All tests passed! Spider AI is working correctly.');
    console.log('🚀 Ready to start the full server.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check your configuration.');
  }
}

runTests();
