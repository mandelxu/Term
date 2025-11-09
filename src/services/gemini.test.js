// src/services/gemini.test.js
import { callApiWithBackoff } from './gemini';

// Mock fetch globally
global.fetch = jest.fn();

describe('Gemini API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock completely
    global.fetch = jest.fn();
  });

  describe('callApiWithBackoff', () => {
    it('should successfully return data on first attempt', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'Test problem generated' }]
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const payload = {
        contents: [{ parts: [{ text: 'Generate a problem' }] }]
      };

      const result = await callApiWithBackoff(payload);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on 429 error and succeed on second attempt', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'Success after retry' }]
            }
          }
        ]
      };

      // First call fails with 429
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      // Second call succeeds
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const payload = {
        contents: [{ parts: [{ text: 'Generate a problem' }] }]
      };

      const result = await callApiWithBackoff(payload);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const payload = {
        contents: [{ parts: [{ text: 'Generate a problem' }] }]
      };

      await expect(callApiWithBackoff(payload, 3)).rejects.toThrow('API Error: Internal Server Error');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle non-retryable errors immediately', async () => {
      const errorResponse = {
        error: {
          message: 'Invalid API key'
        }
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => errorResponse
      });

      global.fetch = mockFetch;

      const payload = {
        contents: [{ parts: [{ text: 'Generate a problem' }] }]
      };

      await expect(callApiWithBackoff(payload)).rejects.toThrow('API Error: Invalid API key');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
