// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // 引入 Header 組件
import Home from "./pages/Home";
import Workshops from "./pages/Workshops";
import Awards from "./pages/Awards";
// 其他可能的分頁引入

const App = () => {
  return (
    <Router>
      <Header /> {/* 將 Header 放在 Routes 外層，確保在所有頁面上都顯示 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/awards" element={<Awards />} />
        {/* 其他路由設定 */}
      </Routes>
    </Router>
  );
};

export default App;
