#!/usr/bin/env node

/**
 * Frontend-Backend Connection Test
 * Verifies frontend can communicate with Fly.io API
 */

const API_URL = 'https://ngocquan-wedding-api.fly.dev';

console.log('🧪 Testing Frontend → Backend Connection\n');
console.log(`📡 API URL: ${API_URL}\n`);

async function testEndpoints() {
  const tests = [
    {
      name: 'Health Check',
      endpoint: '/api/health',
      method: 'GET'
    },
    {
      name: 'Database Health',
      endpoint: '/api/health/database',
      method: 'GET'
    },
    {
      name: 'Guest List (First Page)',
      endpoint: '/api/guests?page=1&limit=5',
      method: 'GET'
    },
    {
      name: 'RSVP Stats (Hue)',
      endpoint: '/api/rsvp/stats/hue',
      method: 'GET'
    },
    {
      name: 'RSVP Stats (Hanoi)',
      endpoint: '/api/rsvp/stats/hanoi',
      method: 'GET'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      console.log(`   ${test.method} ${test.endpoint}`);
      
      const response = await fetch(`${API_URL}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log(`   ✅ SUCCESS`);
        console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
        passed++;
      } else {
        console.log(`   ⚠️  API returned success=false`);
        console.log(`   Response: ${JSON.stringify(data)}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Test Results: ${passed}/${tests.length} passed, ${failed}/${tests.length} failed\n`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Frontend is ready to use the new API.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the API status.\n');
    process.exit(1);
  }
}

try {
  await testEndpoints();
} catch (error) {
  console.error('\n❌ Test suite error:', error);
  process.exit(1);
}
