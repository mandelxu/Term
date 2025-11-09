// src/services/gemini.js
// 封装的 Gemini API 调用逻辑

// 优化：从 .env 文件读取 API 密钥，而不是硬编码
// CRA 要求环境变量以 REACT_APP_ 开头
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: REACT_APP_GEMINI_API_KEY is not set in your .env file.");
  // 可以在 UI 中显示一个更友好的错误
}

const genModel = "gemini-2.5-flash-preview-09-2025";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${genModel}:generateContent?key=${apiKey}`;

/**
 * Calls the generative AI API with exponential backoff
 */
export async function callApiWithBackoff(payload, maxRetries = 3) {
  let attempt = 0;
  let delay = 1000;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        // Retryable errors: rate limiting and server errors
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`API Error: ${response.statusText} (Status: ${response.status})`);
        } else {
          // Non-retryable errors: authentication, validation, etc.
          const errorData = await response.json();
          const error = new Error(`API Error: ${errorData.error?.message || response.statusText}`);
          error.shouldRetry = false; // Mark as non-retryable
          throw error;
        }
      }
      return await response.json();
    } catch (error) {
      // Don't retry if explicitly marked as non-retryable
      if (error.shouldRetry === false) {
        throw error;
      }

      attempt++;
      if (attempt >= maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}