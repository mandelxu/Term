// src/utils/helpers.js
// 所有的辅助函数、常量和小型 UI 组件

import React from 'react';
import { motion } from 'framer-motion';

// --- 格式化函数 ---

export function formatProblemText(s) {
  if (!s) return "";
  return s
    .replace(/[\*`]/g, '') // 移除 markdown 字符
    .replace(/\n\s*\n/g, '\n'); // 折叠多余空行
}

export function formatHtml(s) {
  if (!s) return "";
  return s
    .replace(/\*\*(.*?)\*\*/g, '$1') // 剥离**标记
    .split('\n')
    .filter(line => line.trim() !== '') // 移除空行
    .join('<br />'); // 将有效行转换
}

// --- 小型 UI 组件 ---

export const Fade = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }}>
    {children}
  </motion.div>
);

export const CheckRow = ({ children }) => (
  <li className="flex items-start gap-3">
    <span className="mt-1.5 size-1.5 rounded-full bg-neutral-900" aria-hidden />
    <span className="text-neutral-700 leading-relaxed">{children}</span>
  </li>
);

// --- 逻辑辅助函数 ---

export function canSubmitGuard(problem, hasGenerated, isLoading) {
  if (isLoading) return false;
  if (!hasGenerated) return false;
  if (!problem) return false;
  if (problem === 'Generating new problem...') return false;
  if (problem.startsWith('Error:')) return false;
  return true;
}

export const cycleOption = (currentValue, options) => {
  const currentIndex = options.findIndex(o => o.value === currentValue);
  const nextIndex = (currentIndex + 1) % options.length;
  return options[nextIndex].value;
};

// --- 常量 ---

export const topicOptions = [
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'linear_list', label: 'Linear List' },
  { value: 'stack_queue', label: 'Stack & Queue' },
  { value: 'string', label: 'String' },
  { value: 'array_generalized_list', label: 'Array & Generalized List' },
  { value: 'tree_binary_tree', label: 'Tree & Binary Tree' },
  { value: 'graph', label: 'Graph' },
  { value: 'searching', label: 'Searching' },
  { value: 'sorting', label: 'Sorting' }
];

export const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'cn', label: 'Chinese' },
];

export const defaultSolution = `// draw your solution or type pseudocode
// (demo canvas placeholder)

class DSU {
  constructor(n){ this.p=[...Array(n).keys()]; this.r=Array(n).fill(0); }
  find(x){ return this.p[x]===x?x:this.p[x]=this.find(this.p[x]); }
  union(a,b){ a=this.find(a); b=this.find(b); if(a===b) return; if(this.r[a]<this.r[b]) [a,b]=[b,a]; this.p[b]=a; if(this.r[a]===this.r[b]) this.r[a]++; }
}`;