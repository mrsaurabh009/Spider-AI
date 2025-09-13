const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

console.log('🧪 Testing Spider AI API...\n');

async function testHealth() {
  try {
    console.log('📡 Testing health endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', response.data.status);
    console.log('🔑 Mode:', response.data.mode);
    console.log('🌍 Environment:', response.data.environment);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

async function testRootEndpoint() {
  try {
    console.log('\n📡 Testing root endpoint...');
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root Response:');
    console.log('   Message:', response.data.message);
    console.log('   Status:', response.data.status);
    return true;
  } catch (error) {
    console.log('❌ Root endpoint failed:', error.message);
    return false;
  }
}

async function testAIGeneration() {
  try {
    console.log('\n🤖 Testing AI code generation...');
    
    const testPrompt = 'Create a simple todo list app with React';
    
    console.log('   Prompt:', testPrompt);
    console.log('   Generating code...');
    
    const response = await axios.post(`${BASE_URL}/api/ai/generate`, {
      prompt: testPrompt,
      framework: 'REACT',
      type: 'WEBAPP',
      includeBackend: true,
      includeDatabase: true
    }, {
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ Code Generation Successful!');
    console.log('   Framework:', response.data.data.framework);
    console.log('   Model:', response.data.data.model);
    console.log('   Tokens Used:', response.data.data.usage.totalTokens);
    console.log('   Has Backend:', !!response.data.data.backend);
    console.log('   Has Database:', !!response.data.data.database);
    console.log('   Files Generated:', response.data.data.files.length);
    
    // Show a snippet of generated code
    const frontend = response.data.data.frontend;
    if (frontend) {
      console.log('   Frontend Preview:');
      console.log('   ----------------');
      console.log('  ', frontend.slice(0, 200) + '...');
      console.log('   ----------------');
    }
    
    return true;
  } catch (error) {
    console.log('❌ AI Generation failed:', error.message);
    if (error.response) {
      console.log('   Response status:', error.response.status);
      console.log('   Response data:', error.response.data);
    }
    return false;
  }
}

async function testAIComponent() {
  try {
    console.log('\n🎨 Testing AI component generation...');
    
    const response = await axios.post(`${BASE_URL}/api/ai/component`, {
      componentRequest: 'Create a loading spinner component for React',
      framework: 'REACT',
      context: 'Modern React with TypeScript'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Component Generation Successful!');
    console.log('   Message:', response.data.message);
    
    return true;
  } catch (error) {
    console.log('❌ Component generation failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Spider AI API Tests...\n');
  
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('\n❌ Server health check failed. Make sure the server is running.');
    console.log('   Run: npm run dev:test');
    return;
  }
  
  const rootOk = await testRootEndpoint();
  const aiOk = await testAIGeneration();
  const componentOk = await testAIComponent();
  
  console.log('\n📋 Test Results Summary:');
  console.log('========================');
  console.log('Health Check:', healthOk ? '✅ PASS' : '❌ FAIL');
  console.log('Root Endpoint:', rootOk ? '✅ PASS' : '❌ FAIL');
  console.log('AI Generation:', aiOk ? '✅ PASS' : '❌ FAIL');
  console.log('AI Component:', componentOk ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = healthOk && rootOk && aiOk && componentOk;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Spider AI is working correctly!');
    console.log('🕷️ Your Lovable AI clone is ready to generate applications!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
  }
  
  console.log('\n🔗 Try these URLs in your browser:');
  console.log(`   Health: ${BASE_URL}/health`);
  console.log(`   API Info: ${BASE_URL}/`);
  console.log('\n📖 See README.md for more information.');
}

// Run tests
runAllTests().catch(console.error);
