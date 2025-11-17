import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalLayout from './shared/components/GlobalLayout';
import { MobileMenuProvider } from './shared/contexts/MobileMenuContext';
import Home from './pages/Home';
import QueryGenerator from './pages/QueryGenerator';
import ConcordanceAnalyzer from './pages/ConcordanceAnalyzer';
import './shared/components/animations.css';

function App() {
  return (
    <BrowserRouter>
      <MobileMenuProvider>
        <GlobalLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query-generator" element={<QueryGenerator />} />
            <Route path="/concordance-analyzer" element={<ConcordanceAnalyzer />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </GlobalLayout>
      </MobileMenuProvider>
    </BrowserRouter>
  );
}

export default App;
