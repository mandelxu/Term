// src/PracticeComponent.jsx
// 这是我们之前在 App.jsx 中的所有核心代码
// 它现在被重构为一个独立的组件

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

// 导入图标
import FileCode from "lucide-react/dist/esm/icons/file-code";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";

// 导入拆分出去的组件和服务
import { AutoPaginated } from './components/AutoPaginated';
import { callApiWithBackoff } from './services/gemini';
import {
  formatProblemText,
  formatHtml,
  CheckRow,
  Fade,
  canSubmitGuard,
  cycleOption,
  topicOptions,
  difficultyOptions,
  languageOptions,
  defaultSolution
} from './utils/helpers';


// --- Main Practice Component ---
export default function PracticeComponent() {
  // --- STATE ---
  const [problemRaw, setProblemRaw] = useState("Given `n` nodes and a list of union and find operations, implement a DSU with path compression and union by rank. Report whether each pair is in the same set.");
  const [feedbackRaw, setFeedbackRaw] = useState("");
  const [solution, setSolution] = useState(defaultSolution);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [hasGeneratedProblem, setHasGeneratedProblem] = useState(false);

  const [viewMode, setViewMode] = useState('problem'); // 'problem' | 'feedback'
  const [topic, setTopic] = useState('comprehensive');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('en');

  // --- API Handlers ---
  const handleFetchProblem = useCallback(async () => {
    setIsLoadingProblem(true);
    setFeedbackRaw("");
    setViewMode('problem');
    setProblemRaw("Generating new problem...");

    const systemPrompt = `You are an expert in China's postgraduate entrance examination (408 exam). Your task is to generate a single, high-quality data structures algorithm problem. The problem should be clear, concise, and suitable for a candidate preparing for the 408 exam. Do not include the solution or any hints. Just state the problem clearly. Do not use any markdown formatting (like ** or \`\`). Ensure there are no extra empty lines. The problem must be in ${language === 'cn' ? 'Chinese' : 'English'}.`;
    const userQuery = `Generate one new 408 data structures algorithm problem. Topic: ${topicOptions.find(o => o.value === topic)?.label}. Difficulty: ${difficultyOptions.find(o => o.value === difficulty)?.label}.`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const result = await callApiWithBackoff(payload);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      setProblemRaw(text || "Error: Could not retrieve problem.");
      setHasGeneratedProblem(!!text);
    } catch (error) {
      console.error(error);
      setProblemRaw(`Error: ${error.message || 'Failed to fetch problem.'}`);
      setHasGeneratedProblem(false);
    } finally {
      setIsLoadingProblem(false);
    }
  }, [topic, difficulty, language]);

  const handleGradeSolution = useCallback(async () => {
    if (!solution) return;
    setIsLoadingFeedback(true);
    setFeedbackRaw("Grading your solution...");

    const systemPrompt = `You are an AI assistant grading a solution for a 408 data structures algorithm problem. The user will provide the problem and their solution. Your task is to provide feedback in ${language === 'cn' ? 'Chinese' : 'English'}. Start immediately with the score (e.g., '${language === 'cn' ? '得分' : 'Score'}: 8/10'). Then, in a single, concise paragraph, provide the assessment and 1-2 actionable suggestions. Do not use any subheadings, bold text, or extra empty lines.`;
    const userQuery = `**Problem:**\n${problemRaw}\n\n**User's Solution:**\n${solution}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const result = await callApiWithBackoff(payload);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      setFeedbackRaw(text || "Error: Could not retrieve feedback.");
    } catch (error) {
      console.error(error);
      setFeedbackRaw(`Error: ${error.message || 'Failed to fetch feedback.'}`);
    } finally {
      setIsLoadingFeedback(false);
    }
  }, [problemRaw, solution, language]);

  // --- 视图切换 ---
  const toggleView = () => setViewMode(mode => (mode === 'problem' ? 'feedback' : 'problem'));

  // --- JSX for the Practice Area ---
  return (
    <Fade delay={0.1}>
      <div className="mt-14 md:mt-20 border border-neutral-200 rounded-3xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 h-10 border-b border-neutral-200">
          <span className="size-2.5 rounded-full bg-neutral-900" />
          <span className="size-2.5 rounded-full bg-neutral-400" />
          <span className="size-2.5 rounded-full bg-neutral-200" />
          <span className="ml-3 text-sm text-neutral-500">Term — Live Practice Session</span>
        </div>

        <div className="grid md:grid-cols-2 items-stretch">
          {/* 左侧 */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">{viewMode === 'problem' ? 'Exercise' : 'AI Feedback'}</div>
              <button
                onClick={handleFetchProblem}
                disabled={isLoadingProblem}
                className="inline-flex items-center rounded-full border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                {isLoadingProblem ? 'Generating...' : 'Get New Problem'}
              </button>
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-2">{viewMode === 'problem' ? 'Problem' : 'Assessment'}</h3>
            <div className="flex-1 min-h-0">
              <AutoPaginated text={viewMode === 'problem' ? problemRaw : feedbackRaw} isHtml={viewMode !== 'problem'} />
            </div>

            {/* 底部参数设置区 */}
            <div className="mt-auto pt-4">
              <ul className="space-y-2 text-neutral-700">
                <CheckRow>
                  <span className="text-neutral-500">Data Structures: </span>
                  <button
                    onClick={() => setTopic(cycleOption(topic, topicOptions))}
                    className="font-medium text-neutral-900 hover:opacity-70 focus:outline-none focus:underline"
                    title="Click to change topic"
                  >
                    {topicOptions.find(o => o.value === topic)?.label}
                  </button>
                </CheckRow>
                <CheckRow>
                  <span className="text-neutral-500">Difficulty: </span>
                  <button
                    onClick={() => setDifficulty(cycleOption(difficulty, difficultyOptions))}
                    className="font-medium text-neutral-900 hover:opacity-70 focus:outline-none focus:underline"
                    title="Click to change difficulty"
                  >
                    {difficultyOptions.find(o => o.value === difficulty)?.label}
                  </button>
                </CheckRow>
                <CheckRow>
                  <span className="text-neutral-500">Language: </span>
                  <button
                    onClick={() => setLanguage(cycleOption(language, languageOptions))}
                    className="font-medium text-neutral-900 hover:opacity-70 focus:outline-none focus:underline"
                    title="Click to change language"
                  >
                    {languageOptions.find(o => o.value === language)?.label}
                  </button>
                </CheckRow>
              </ul>
            </div>
          </div>

          {/* 右侧 */}
          <div className="p-6 md:p-8 border-t md:border-l border-neutral-200 flex flex-col">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-2 flex items-center gap-2"><FileCode className="size-4"/> Handwritten Code Pad</div>
            <div className="flex flex-col flex-1">
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Write your algorithm or pseudocode here..."
                className="w-full min-h-[288px] h-auto flex-1 resize-none font-mono text-sm leading-relaxed rounded-xl border border-neutral-200 p-4 focus:border-neutral-400 focus:outline-none transition-colors"
              />
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={handleGradeSolution}
                  disabled={!hasGeneratedProblem || isLoadingFeedback}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors border ${(!hasGeneratedProblem || isLoadingFeedback) ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700'}`}
                >
                  {isLoadingFeedback ? 'Grading...' : 'Submit'}
                </button>
                {feedbackRaw && !isLoadingFeedback && (
                  <button
                    onClick={toggleView}
                    className="inline-flex items-center rounded-full border border-neutral-900 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    {viewMode === 'problem' ? 'View Feedback' : 'Back to Problem'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}