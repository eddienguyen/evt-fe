/**
 * Vietnamese Font Detection Test
 * 
 * Quick test to verify Vietnamese font detection is working correctly.
 * Run this in browser console to see the detected font.
 */

// Test Vietnamese characters
const testVietnamese = "Anh Chị ắằẳẵặấầẩẫậếềểễệốồổỗộớờởỡợứừửữựỳýỷỹỵ";

// Import the font loading function
import { loadDancingScriptFont } from '../canvasConfig';

export async function testFontDetection() {
  console.log('🔍 Testing Vietnamese font detection...');
  console.log('Test string:', testVietnamese);
  
  try {
    const detectedFont = await loadDancingScriptFont();
    console.log('✅ Detected font:', detectedFont);
    
    // Test rendering
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.font = `48px ${detectedFont}`;
      ctx.fillText(testVietnamese, 10, 100);
      
      // Display canvas for visual verification
      document.body.appendChild(canvas);
      canvas.style.border = '2px solid blue';
      canvas.style.margin = '20px';
      
      console.log('✅ Test canvas rendered - check above');
    }
  } catch (error) {
    console.error('❌ Font detection failed:', error);
  }
}

// Auto-run test if in browser console
if (typeof window !== 'undefined') {
  // Uncomment to auto-run: testFontDetection();
}
