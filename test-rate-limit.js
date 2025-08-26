#!/usr/bin/env node

/**
 * ai gen
 * Simple Rate Limit Test
 * Tests that the middleware rate limiting is working properly
 */

const API_BASE = 'http://localhost:3000';

async function testRateLimit() {
  console.log('🧪 Testing rate limit with sliding window...\n');

  for (let i = 1; i <= 105; i++) {
    // Test beyond the 100 req/min limit
    try {
      const response = await fetch(`${API_BASE}/api/challenges`);

      const remaining = response.headers.get('x-ratelimit-remaining');
      const limit = response.headers.get('x-ratelimit-limit');

      if (response.status === 429) {
        console.log(`❌ Request ${i}: Rate limited! (${response.status})`);
        const body = await response.json();
        console.log(`   Message: ${body.message}`);
        break;
      } else {
        console.log(`✅ Request ${i}: ${response.status} (Remaining: ${remaining}/${limit})`);
      }

      // Small delay to simulate real usage
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`❌ Request ${i} failed:`, error.message);
      break;
    }
  }

  console.log('\n✨ Rate limit test complete!');
}

testRateLimit();
