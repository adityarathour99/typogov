
import React, { useState } from 'react';
import { TypingStats, MistakeDetail, Language } from '../types';
import { Download, RefreshCw, FileSearch, Table, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Props {
  stats: TypingStats;
  details: MistakeDetail[];
  language: Language;
  sourceText: string;
  typedText: string;
  onRestart: () => void;
}

const ResultsDashboard: React.FC<Props> = ({ stats, details, language, sourceText, typedText, onRestart }) => {
  const [view, setView] = useState<'compare' | 'table'>('compare');

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Typing Examination Result', 20, 20);
    doc.setFontSize(12);
    doc.text(`Language: ${language}`, 20, 35);
    doc.text(`Gross Speed: ${stats.grossWpm} WPM`, 20, 45);
    doc.text(`Net Speed: ${stats.netWpm} WPM`, 20, 55);
    doc.text(`Accuracy: ${stats.accuracy}%`, 20, 65);
    doc.text(`Full Mistakes: ${stats.fullMistakes}`, 20, 75);
    doc.text(`Half Mistakes: ${stats.halfMistakes}`, 20, 85);
    doc.save('result.pdf');
  };

  const sourceWords = sourceText.trim().split(/\s+/);
  const typedWords = typedText.trim().split(/\s+/);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      {/* Primary Metrics Header */}
      <div className="bg-white rounded-3xl border shadow-xl p-8 grid grid-cols-1 md:grid-cols-4 gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50" />
        
        <div className="text-center md:text-left space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross WPM</p>
          <p className="text-5xl font-black text-gray-800">{stats.grossWpm}</p>
        </div>

        <div className="text-center md:text-left space-y-1 bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Net WPM Speed</p>
          <p className="text-5xl font-black text-white">{stats.netWpm}</p>
        </div>

        <div className="text-center md:text-left space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accuracy</p>
          <p className="text-5xl font-black text-green-600">{stats.accuracy}%</p>
        </div>

        <div className="text-center md:text-left space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Mistakes</p>
          <p className="text-5xl font-black text-red-600">{stats.fullMistakes + stats.halfMistakes}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
        <div className="bg-gray-50/50 px-8 py-5 border-b flex flex-wrap gap-4 justify-between items-center">
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button 
              onClick={() => setView('compare')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'compare' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              <FileSearch className="w-4 h-4" /> Side-by-Side Review
            </button>
            <button 
              onClick={() => setView('table')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'table' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              <Table className="w-4 h-4" /> Error List
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={exportPDF} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm">
              <Download className="w-4 h-4" /> PDF Result
            </button>
            <button onClick={onRestart} className="flex items-center gap-2 px-6 py-2.5 bg-white border rounded-xl hover:bg-gray-50 transition-all font-bold text-sm">
              <RefreshCw className="w-4 h-4" /> Restart
            </button>
          </div>
        </div>

        <div className="p-8">
          {view === 'compare' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Expected Passage</h4>
                </div>
                <div className="bg-gray-50/30 rounded-2xl p-6 h-[500px] overflow-y-auto leading-relaxed text-lg font-serif select-none border border-dashed">
                  {sourceWords.map((word, i) => {
                    const isError = typedWords[i] !== undefined && typedWords[i] !== word;
                    return (
                      <span key={i} className={`mr-2 inline-block ${isError ? 'bg-red-100 text-red-700 rounded px-1' : ''}`}>
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Your Typed Text</h4>
                </div>
                <div className="bg-white rounded-2xl p-6 h-[500px] overflow-y-auto leading-relaxed text-lg font-serif border-2 border-indigo-50 shadow-inner">
                  {typedWords.map((word, i) => {
                    const isCorrect = word === sourceWords[i];
                    const isExtra = i >= sourceWords.length;
                    return (
                      <span key={i} className={`mr-2 inline-block ${isCorrect ? 'text-green-600' : isExtra ? 'text-purple-500 underline' : 'text-red-600 font-bold underline decoration-2'}`}>
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden border rounded-2xl">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Word #</th>
                    <th className="px-8 py-4">Expected</th>
                    <th className="px-8 py-4">Actual Typed</th>
                    <th className="px-8 py-4">Error Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {details.map((m, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4 font-mono text-gray-400">#{i + 1}</td>
                      <td className="px-8 py-4 font-serif">{m.expected}</td>
                      <td className="px-8 py-4 font-serif text-red-600 font-bold">{m.typed}</td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${m.type === 'Full' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {m.type} Mistake
                        </span>
                      </td>
                    </tr>
                  ))}
                  {details.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400 font-bold italic">No errors found. Perfect score!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
