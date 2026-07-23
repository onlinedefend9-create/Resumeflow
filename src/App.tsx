/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './i18n/LanguageContext';
import { CVDataProvider } from './hooks/useCVData';
import { Editor } from './components/editor/Editor';
import { Home } from './pages/Home';
import { Templates } from './pages/Templates';
import { Pricing } from './pages/Pricing';
import { Blog } from './pages/Blog';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
          <CVDataProvider>
            <div className="min-h-screen flex flex-col bg-white text-[#0a0a0a]">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cv-generator" element={<Editor />} />
                  <Route path="/cv-templates" element={<Templates />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPostDetail />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CVDataProvider>
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  );
}


