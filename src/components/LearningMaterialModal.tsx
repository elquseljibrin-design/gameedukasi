import React, { useState } from 'react';
import { LEARNING_MATERIALS } from '../data/learningMaterials';
import { X, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';

interface LearningMaterialModalProps {
  onClose: () => void;
}

export const LearningMaterialModal: React.FC<LearningMaterialModalProps> = ({ onClose }) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(LEARNING_MATERIALS[0].id);
  const currentTopic = LEARNING_MATERIALS.find((m) => m.id === activeTopicId) || LEARNING_MATERIALS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h2 className="font-pixel text-base text-teal-400">MATERI PEMBELAJARAN INFORMATIKA</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 overflow-x-auto bg-slate-900/60 shrink-0">
          {LEARNING_MATERIALS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTopicId === topic.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {topic.title.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-teal-400 font-bold block mb-1">
              {currentTopic.category}
            </span>
            <h3 className="text-xl font-bold text-white mb-2">{currentTopic.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {currentTopic.summary}
            </p>
          </div>

          {/* Key Points */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200">Poin Kunci & Penjelasan:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentTopic.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <h5 className="font-semibold text-xs text-amber-400 mb-1">{point.label}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">{point.desc}</p>
                  </div>
                  {point.example && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-sky-300 italic">
                      <strong className="text-sky-400 not-italic">Contoh: </strong>
                      {point.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Pseudocode Snippet */}
          {currentTopic.pseudocodeExample && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 block mb-2">
                Contoh Struktur Penulisan Pseudocode:
              </span>
              <pre className="font-mono text-xs text-slate-200 whitespace-pre overflow-x-auto leading-relaxed">
                {currentTopic.pseudocodeExample}
              </pre>
            </div>
          )}

          {/* Tips Banner */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-center gap-3 text-xs text-amber-200">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Tips Belajar:</strong> {currentTopic.tips}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
