import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { Canvas } from './Canvas';
import { SEO } from '../SEO';

export const Editor = () => {
  const [activeTab, setActiveTab] = useState('sections');

  return (
    <div className="flex h-screen bg-zinc-100/70 text-[#0a0a0a] font-sans overflow-hidden">
      <SEO
        title="Éditeur de CV Visuel | CV Craft"
        description="Créez et personnalisez votre CV en temps réel avec notre éditeur visuel glisser-déposer."
      />

      {/* Dark Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Glassmorphism Toolbar */}
        <Toolbar />

        {/* Canvas Editing Space */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-zinc-100/80 flex justify-center items-start">
          <div className="w-full max-w-4xl py-4">
            <Canvas />
          </div>
        </main>
      </div>
    </div>
  );
};


