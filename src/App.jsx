// src/App.jsx
// 这是新的 App.jsx, 充当应用的外壳

import React from 'react';
import PracticeComponent from './PracticeComponent'; // 导入我们的核心组件

/** 宿主应用 */
export default function App() {
  return (
    // 应用的根布局
    <div className="min-h-screen bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      {/* 未来这里可以添加路由 (React Router) 
        或全局页眉/页脚。
        现在，我们只居中显示练习组件。
      */}
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <PracticeComponent />
      </div>
    </div>
  );
}