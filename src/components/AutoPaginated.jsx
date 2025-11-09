// src/components/AutoPaginated.jsx
// 智能分页组件

import React, { useState, useCallback, useMemo } from "react";
import { formatHtml, formatProblemText } from '../utils/helpers';
import { PaginatedContent } from './PaginatedContent'; // 导入显示组件

export const AutoPaginated = ({ text, isHtml = false }) => {
  const [pages, setPages] = useState([]);
  const viewportRef = React.useRef(null);
  const measurerRef = React.useRef(null);

  const naturalBreak = (src, start, end) => {
    const windowText = src.slice(start, end);
    const BREAK = new Set([' ', '\n', ',', '.', ';', ':', '!', '?', '，', '。', '；', '！', '？', '、', ']', ')', '】', '》', '»']);
    for (let i = windowText.length - 1; i >= Math.max(0, windowText.length - 40); i--) {
      if (BREAK.has(windowText[i])) return start + i + 1;
    }
    return end;
  };

  const paginate = React.useCallback(() => {
    const viewport = viewportRef.current;
    const measurer = measurerRef.current;
    const full = text || '';
    if (!viewport || !measurer) { setPages([full]); return; }
    const available = viewport.clientHeight;
    const result = [];
    let pos = 0;
    while (pos < full.length) {
      let low = pos + 1;
      let high = full.length;
      let best = pos + 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const slice = full.slice(pos, mid);
        if (isHtml) {
          measurer.innerHTML = formatHtml(slice);
        } else {
          measurer.textContent = formatProblemText(slice);
        }
        const h = measurer.scrollHeight;
        if (h <= available) { best = mid; low = mid + 1; } else { high = mid - 1; }
      }
      if (best <= pos) best = Math.min(pos + 50, full.length);
      const safeEnd = naturalBreak(full, pos, best);
      result.push(full.slice(pos, safeEnd));
      pos = safeEnd;
    }
    setPages(result.length ? result : [full]);
  }, [text, isHtml]);

  React.useEffect(() => { paginate(); }, [paginate, text, isHtml]);

  return (
    <div className="relative">
      {/* hidden viewport+measurer */}
      <div ref={viewportRef} className="h-72 absolute inset-x-0 top-0" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
        <div ref={measurerRef} className="text-neutral-600 leading-relaxed whitespace-pre-wrap break-words"></div>
      </div>
      <PaginatedContent pages={pages} isHtml={isHtml} />
    </div>
  );
};