
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Language, 
  BackspaceMode, 
  ExamSettings, 
  TypingStats, 
  MistakeDetail 
} from './types';
import { PASSAGES, KRUTIDEV_MAP } from './constants';
import { calculateStats, calculateMistakes } from './utils/calculations';
import SettingsPanel from './components/SettingsPanel';
import ResultsDashboard from './components/ResultsDashboard';
import { Keyboard, Play, Pause, RotateCcw, Layout, Clock, Activity, AlertCircle, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [settings, setSettings] = useState<ExamSettings>({
    language: Language.ENGLISH,
    timerMinutes: 5,
    highlightEnabled: false, // Defaulting to False for realism
    backspaceMode: BackspaceMode.FULL,
    showStats: true,
    useCustomPassage: false,
    customPassage: "",
  });

  const [passage, setPassage] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [mistakeDetails, setMistakeDetails] = useState<MistakeDetail[]>([]);

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize Exam
  useEffect(() => {
    let finalPassage = "";
    if (settings.useCustomPassage && settings.customPassage.trim()) {
      finalPassage = settings.customPassage.trim();
    } else {
      const langPassages = PASSAGES[settings.language];
      finalPassage = langPassages[Math.floor(Math.random() * langPassages.length)];
    }
    
    setPassage(finalPassage);
    setTimeLeft(settings.timerMinutes * 60);
    resetExam();
  }, [settings.language, settings.timerMinutes, settings.useCustomPassage, settings.customPassage]);

  const resetExam = () => {
    setIsActive(false);
    setIsFinished(false);
    setTypedText('');
    setTotalStrokes(0);
    setStats(null);
    setMistakeDetails([]);
    setTimeLeft(settings.timerMinutes * 60);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const finishExam = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const timeTotalSeconds = settings.timerMinutes * 60;
    const timeUsed = timeTotalSeconds - timeLeft;
    
    const finalStats = calculateStats(
      passage,
      typedText,
      timeUsed,
      totalStrokes
    );
    const { details } = calculateMistakes(passage, typedText);
    
    setStats(finalStats);
    setMistakeDetails(details);
  }, [passage, typedText, timeLeft, totalStrokes, settings.timerMinutes]);

  // Timer Logic
  const finishExamRef = useRef(finishExam);
  useEffect(() => {
    finishExamRef.current = finishExam;
  }, [finishExam]);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      finishExamRef.current();
    }
  }, [timeLeft, isActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    if (!isActive) setIsActive(true);

    let val = e.target.value;

    // Krutidev Mapping Logic
    if (settings.language === Language.HINDI_KRUTIDEV) {
      const lastChar = val.slice(-1);
      if (KRUTIDEV_MAP[lastChar]) {
        val = val.slice(0, -1) + KRUTIDEV_MAP[lastChar];
      }
    }
    setTypedText(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    // 1. Anti-Inflation: Ignore repeated key events from holding down a key
    if (e.repeat) {
      e.preventDefault();
      return;
    }

    // 2. Security: Disable Paste
    if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      return;
    }

    // 3. Start timer on first key if not already active
    if (!isActive && e.key.length === 1) {
      setIsActive(true);
    }

    // 4. Backspace Logic
    if (e.key === 'Backspace') {
      if (settings.backspaceMode === BackspaceMode.NO_BACKSPACE) {
        e.preventDefault();
        return;
      }
      if (settings.backspaceMode === BackspaceMode.LIMITED) {
        if (typedText.endsWith(' ') || typedText.length === 0) {
          e.preventDefault();
          return;
        }
      }
    }

    // 5. Stroke Tracking: Keys that contribute to characters/spaces
    if (isActive && (e.key.length === 1 || e.key === 'Enter')) {
      setTotalStrokes((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fafafa]">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
              <Keyboard className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">TypoGov</h1>
              <p className="text-[10px] text-indigo-500 font-black uppercase mt-1.5 tracking-widest">Govt-Grade Evaluation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-100'}`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-black text-xl">{formatTime(timeLeft)}</span>
            </div>
            
            {!isFinished && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`flex items-center gap-2 px-7 py-2.5 rounded-2xl font-black transition-all transform active:scale-95 shadow-xl ${
                    isActive ? 'bg-amber-100 text-amber-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isActive ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Begin Test</>}
                </button>
                <button onClick={resetExam} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-gray-100 bg-white">
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <SettingsPanel settings={settings} setSettings={setSettings} disabled={isActive} />
              
              {settings.showStats && (
                <div className="mt-8 bg-white border rounded-3xl p-8 shadow-sm text-center">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Strokes Count</h3>
                  <p className="text-5xl font-black text-indigo-600 font-mono">{totalStrokes}</p>
                  <p className="text-xs text-gray-400 mt-2 font-bold">Estimated {Math.floor(totalStrokes / 5)} Words</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col">
                <div className="bg-indigo-50/30 px-8 py-4 border-b flex items-center justify-between">
                  <span className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-3 tracking-[0.2em]">
                    <Layout className="w-4 h-4" /> Exam Paper
                  </span>
                </div>
                <div className={`text-xl leading-[1.8] p-8 h-72 overflow-y-auto no-select font-serif text-gray-500 ${settings.language === Language.HINDI_KRUTIDEV ? 'font-krutidev' : ''}`}>
                  {passage.trim().split(/\s+/).map((word, idx) => {
                    const typedWords = typedText.trim().split(/\s+/);
                    const currentWordIdx = typedText.endsWith(' ') ? typedWords.length : typedWords.length - 1;
                    
                    let className = "mx-1 inline-block transition-all duration-200 ";
                    
                    if (settings.highlightEnabled) {
                      if (idx < currentWordIdx) {
                        const originalWords = passage.trim().split(/\s+/);
                        const isCorrect = typedWords[idx] === originalWords[idx];
                        className += isCorrect ? "text-green-600 font-medium " : "text-red-600 underline decoration-2 font-medium ";
                      } else if (idx === currentWordIdx) {
                        className += "bg-yellow-200 px-1.5 rounded-md text-gray-900 font-bold shadow-sm ";
                      }
                    } else if (idx === currentWordIdx && isActive) {
                      className += "border-b-2 border-indigo-400 text-gray-800 ";
                    }
                    
                    return <span key={idx} className={className}>{word}</span>;
                  })}
                </div>
              </div>

              <div className="relative group">
                <textarea
                  ref={inputRef}
                  disabled={isFinished}
                  value={typedText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onContextMenu={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  placeholder={isActive ? "Match the text above..." : "Start typing to begin..."}
                  className={`w-full h-80 p-10 text-xl leading-relaxed rounded-[2.5rem] border-2 transition-all outline-none resize-none shadow-xl ${
                    !isActive ? 'bg-gray-100/50 border-transparent opacity-60' : 'bg-white border-indigo-500'
                  } ${settings.language === Language.HINDI_KRUTIDEV ? 'font-krutidev' : ''}`}
                  spellCheck={false}
                />
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={finishExam}
                  disabled={!isActive}
                  className="bg-gray-900 text-white px-16 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-black transition-all disabled:opacity-30"
                >
                  Submit Final Examination
                </button>
              </div>
            </div>
          </div>
        ) : (
          stats && (
            <ResultsDashboard 
              stats={stats} 
              details={mistakeDetails} 
              language={settings.language} 
              sourceText={passage}
              typedText={typedText}
              onRestart={resetExam} 
            />
          )
        )}
      </main>
    </div>
  );
};

export default App;
