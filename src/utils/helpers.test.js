// src/utils/helpers.test.js
import {
  formatProblemText,
  formatHtml,
  canSubmitGuard,
  cycleOption,
  topicOptions,
  difficultyOptions,
  languageOptions
} from './helpers';

describe('Helper Functions', () => {
  describe('formatProblemText', () => {
    it('should remove markdown characters', () => {
      const input = '**Bold** and `code` text';
      const result = formatProblemText(input);
      expect(result).toBe('Bold and code text');
    });

    it('should collapse multiple empty lines', () => {
      const input = 'Line 1\n\n\nLine 2';
      const result = formatProblemText(input);
      expect(result).toBe('Line 1\nLine 2');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatProblemText(null)).toBe('');
      expect(formatProblemText(undefined)).toBe('');
      expect(formatProblemText('')).toBe('');
    });

    it('should handle complex formatting', () => {
      const input = '**Problem:** `array[i]`\n\n\n**Solution:**\n\nTest';
      const result = formatProblemText(input);
      expect(result).toBe('Problem: array[i]\nSolution:\nTest');
    });
  });

  describe('formatHtml', () => {
    it('should strip bold markdown and convert to br tags', () => {
      const input = '**Score:** 8/10\nGood solution';
      const result = formatHtml(input);
      expect(result).toBe('Score: 8/10<br />Good solution');
    });

    it('should remove empty lines', () => {
      const input = 'Line 1\n\nLine 2\n\n\nLine 3';
      const result = formatHtml(input);
      expect(result).toBe('Line 1<br />Line 2<br />Line 3');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatHtml(null)).toBe('');
      expect(formatHtml(undefined)).toBe('');
      expect(formatHtml('')).toBe('');
    });

    it('should handle text with only empty lines', () => {
      const input = '\n\n\n';
      const result = formatHtml(input);
      expect(result).toBe('');
    });
  });

  describe('canSubmitGuard', () => {
    it('should return false when loading', () => {
      expect(canSubmitGuard('Valid problem', true, true)).toBe(false);
    });

    it('should return false when problem not generated', () => {
      expect(canSubmitGuard('Valid problem', false, false)).toBe(false);
    });

    it('should return false when problem is null/empty', () => {
      expect(canSubmitGuard('', true, false)).toBe(false);
      expect(canSubmitGuard(null, true, false)).toBe(false);
    });

    it('should return false when problem is still generating', () => {
      expect(canSubmitGuard('Generating new problem...', true, false)).toBe(false);
    });

    it('should return false when problem has error', () => {
      expect(canSubmitGuard('Error: Failed to fetch', true, false)).toBe(false);
    });

    it('should return true for valid problem', () => {
      expect(canSubmitGuard('Valid algorithm problem here', true, false)).toBe(true);
    });
  });

  describe('cycleOption', () => {
    it('should cycle through options correctly', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' }
      ];

      expect(cycleOption('a', options)).toBe('b');
      expect(cycleOption('b', options)).toBe('c');
      expect(cycleOption('c', options)).toBe('a'); // cycle back to start
    });

    it('should work with difficulty options', () => {
      expect(cycleOption('easy', difficultyOptions)).toBe('medium');
      expect(cycleOption('medium', difficultyOptions)).toBe('hard');
      expect(cycleOption('hard', difficultyOptions)).toBe('easy');
    });

    it('should work with language options', () => {
      expect(cycleOption('en', languageOptions)).toBe('cn');
      expect(cycleOption('cn', languageOptions)).toBe('en');
    });
  });

  describe('Constants', () => {
    it('should have valid topic options', () => {
      expect(topicOptions).toHaveLength(9);
      expect(topicOptions[0]).toEqual({ value: 'comprehensive', label: 'Comprehensive' });
    });

    it('should have valid difficulty options', () => {
      expect(difficultyOptions).toHaveLength(3);
      expect(difficultyOptions).toEqual([
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
      ]);
    });

    it('should have valid language options', () => {
      expect(languageOptions).toHaveLength(2);
      expect(languageOptions).toEqual([
        { value: 'en', label: 'English' },
        { value: 'cn', label: 'Chinese' }
      ]);
    });
  });
});
