// src/PracticeComponent.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PracticeComponent from './PracticeComponent';
import * as geminiService from './services/gemini';

// Mock the gemini service
jest.mock('./services/gemini');

// Mock lucide-react icons
jest.mock('lucide-react/dist/esm/icons/file-code', () => ({
  __esModule: true,
  default: () => <div>FileCode Icon</div>
}));

jest.mock('lucide-react/dist/esm/icons/chevron-left', () => ({
  __esModule: true,
  default: () => <div>ChevronLeft Icon</div>
}));

jest.mock('lucide-react/dist/esm/icons/chevron-right', () => ({
  __esModule: true,
  default: () => <div>ChevronRight Icon</div>
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, whileInView, viewport, transition, ...props }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('PracticeComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with default problem', () => {
    render(<PracticeComponent />);

    expect(screen.getByText('Term — Live Practice Session')).toBeInTheDocument();
    expect(screen.getByText('Problem')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your algorithm or pseudocode here...')).toBeInTheDocument();
  });

  it('should have Get New Problem button', () => {
    render(<PracticeComponent />);

    const button = screen.getByText('Get New Problem');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should fetch new problem when Get New Problem is clicked', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'New algorithm problem' }]
          }
        }
      ]
    };

    geminiService.callApiWithBackoff.mockResolvedValue(mockResponse);

    render(<PracticeComponent />);

    const button = screen.getByText('Get New Problem');
    fireEvent.click(button);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });

    // Should call the API
    expect(geminiService.callApiWithBackoff).toHaveBeenCalledTimes(1);

    // Should display the new problem
    await waitFor(() => {
      expect(screen.queryByText('Generating...')).not.toBeInTheDocument();
    });
  });

  it('should enable Submit button after problem is generated', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Test problem' }]
          }
        }
      ]
    };

    geminiService.callApiWithBackoff.mockResolvedValue(mockResponse);

    render(<PracticeComponent />);

    // Initially Submit should be disabled
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();

    // Generate a problem
    const newProblemButton = screen.getByText('Get New Problem');
    fireEvent.click(newProblemButton);

    await waitFor(() => {
      expect(geminiService.callApiWithBackoff).toHaveBeenCalled();
    });

    // Wait for problem to be generated
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should submit solution and show feedback', async () => {
    const problemResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Algorithm problem here' }]
          }
        }
      ]
    };

    const feedbackResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Score: 9/10. Great solution!' }]
          }
        }
      ]
    };

    geminiService.callApiWithBackoff
      .mockResolvedValueOnce(problemResponse)
      .mockResolvedValueOnce(feedbackResponse);

    render(<PracticeComponent />);

    // Generate a problem first
    const newProblemButton = screen.getByText('Get New Problem');
    fireEvent.click(newProblemButton);

    await waitFor(() => {
      expect(screen.getByText('Submit')).not.toBeDisabled();
    });

    // Enter solution
    const textarea = screen.getByPlaceholderText('Write your algorithm or pseudocode here...');
    fireEvent.change(textarea, { target: { value: 'My solution here' } });

    // Submit solution
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Should show grading state
    await waitFor(() => {
      expect(screen.getByText('Grading...')).toBeInTheDocument();
    });

    // Should show View Feedback button after grading
    await waitFor(() => {
      expect(screen.getByText('View Feedback')).toBeInTheDocument();
    });
  });

  it('should cycle through topic options when clicked', () => {
    render(<PracticeComponent />);

    const topicButton = screen.getByText('Comprehensive');

    // Click to cycle to next option
    fireEvent.click(topicButton);
    expect(screen.getByText('Linear List')).toBeInTheDocument();

    // Click again
    fireEvent.click(screen.getByText('Linear List'));
    expect(screen.getByText('Stack & Queue')).toBeInTheDocument();
  });

  it('should cycle through difficulty options when clicked', () => {
    render(<PracticeComponent />);

    const difficultyButton = screen.getByText('Medium');

    fireEvent.click(difficultyButton);
    expect(screen.getByText('Hard')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hard'));
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('should cycle through language options when clicked', () => {
    render(<PracticeComponent />);

    const languageButton = screen.getByText('English');

    fireEvent.click(languageButton);
    expect(screen.getByText('Chinese')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Chinese'));
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    geminiService.callApiWithBackoff.mockRejectedValue(new Error('API Error'));

    render(<PracticeComponent />);

    const button = screen.getByText('Get New Problem');
    fireEvent.click(button);

    await waitFor(() => {
      expect(geminiService.callApiWithBackoff).toHaveBeenCalled();
    });

    // Submit button should remain disabled on error
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('should allow switching between problem and feedback views', async () => {
    const problemResponse = {
      candidates: [{ content: { parts: [{ text: 'Test problem' }] } }]
    };

    const feedbackResponse = {
      candidates: [{ content: { parts: [{ text: 'Score: 8/10' }] } }]
    };

    geminiService.callApiWithBackoff
      .mockResolvedValueOnce(problemResponse)
      .mockResolvedValueOnce(feedbackResponse);

    render(<PracticeComponent />);

    // Generate problem
    fireEvent.click(screen.getByText('Get New Problem'));
    await waitFor(() => expect(screen.getByText('Submit')).not.toBeDisabled());

    // Submit solution
    fireEvent.change(screen.getByPlaceholderText('Write your algorithm or pseudocode here...'), {
      target: { value: 'Solution' }
    });
    fireEvent.click(screen.getByText('Submit'));

    // Wait for feedback
    await waitFor(() => expect(screen.getByText('View Feedback')).toBeInTheDocument());

    // Switch to feedback view
    fireEvent.click(screen.getByText('View Feedback'));
    expect(screen.getByText('Assessment')).toBeInTheDocument();

    // Switch back to problem view
    fireEvent.click(screen.getByText('Back to Problem'));
    expect(screen.getByText('Problem')).toBeInTheDocument();
  });
});
