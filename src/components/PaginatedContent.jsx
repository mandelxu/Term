// src/components/PaginatedContent.jsx
// 分页内容的纯显示组件

import React, { useState, useEffect } from "react";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { formatHtml, formatProblemText } from '../utils/helpers';

export const PaginatedContent = ({ pages, isHtml = false }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const goToPrev = () => setCurrentPage(p => Math.max(0, p - 1));
  const goToNext = () => setCurrentPage(p => Math.min(pages.length - 1, p + 1));

  useEffect(() => { setCurrentPage(0); }, [pages]);

  const content = pages[currentPage] || "";

  return (
    <div className="flex flex-col h-full">
      <div className="h-72 overflow-hidden">
        {isHtml ? (
          <div className="text-neutral-600 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: formatHtml(content) }} />
        ) : (
          <p className="text-neutral-600 mb-2 whitespace-pre-wrap break-words">
            {formatProblemText(content)}
          </p>
        )}
      </div>
      <div className="flex items-center justify-end gap-2 pt-1 h-8">
        <span className={`text-xs text-neutral-500 ${pages.length > 1 ? '' : 'invisible'}`}>
          Page {Math.min(currentPage + 1, Math.max(pages.length, 1))} of {Math.max(pages.length, 1)}
        </span>
        <button
          onClick={goToPrev}
          disabled={currentPage === 0 || pages.length <= 1}
          className={`size-7 flex items-center justify-center rounded-full border text-neutral-900 hover:bg-neutral-100 disabled:opacity-50 ${pages.length <= 1 ? 'invisible border-neutral-200' : 'border-neutral-200'}`}
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentPage === pages.length - 1 || pages.length <= 1}
          className={`size-7 flex items-center justify-center rounded-full border text-neutral-900 hover:bg-neutral-100 disabled:opacity-50 ${pages.length <= 1 ? 'invisible border-neutral-200' : 'border-neutral-200'}`}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};