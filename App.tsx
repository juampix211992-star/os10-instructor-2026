
import React, { useState, useEffect } from 'react';
import { AppMode, Message, Difficulty, QuizAttempt } from './types';
import { STUDY_MODULES } from './constants';
import StudyPortal from './components/StudyPortal';
import QuizView from './components/QuizView';
import TrueFalseView from './components/TrueFalseView';
import VisualStudy from './components/VisualStudy';
import ResultsView from './components/ResultsView';
import { getChatWithNavigation, generateQuiz } from './geminiService';

interface UserAccount {
  username: string;
  password?: string;
  status: 'pending' | 'approved' | 'blocked';
  isAdmin: boolean;
}

const App: React.FC = () => {
  // --- AUTH & DATA ---
  // Usuario por defecto sin necesidad de autenticación
  const [currentUser] = useState<UserAccount | null>({ 
    username: 'estudiante', 
    status: 'approved', 
    isAdmin: false 
  });

  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('os10_history_estudiante');
    return saved ? JSON.parse(saved) : [];
  });

  // --- APP STATE ---
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState<string>("Examen Integral OS10 (Ley 21.659 y Res. 2183)");
  const [quizType, setQuizType] = useState<'multiple' | 'trueFalse'>('multiple');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [quizScore, setQuizScore] = useState<{ score: number, total: number } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState<any[] | null>(null);
  const [isPreparingQuiz, setIsPreparingQuiz] = useState(false);

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<Message[]>([
    { role: 'model', text: 'Bienvenido al sistema de control 2026. ¿En qué módulo de seguridad te gustaría profundizar hoy?', timestamp: new Date() }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [diagOpen, setDiagOpen] = useState(false);
  const [diagResult, setDiagResult] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('os10_history_estudiante', JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Confirmación al abandonar examen sin terminar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (mode === AppMode.EXAM || mode === AppMode.TRUE_FALSE) {
        if (!quizScore) { // Si aún no terminó
          e.preventDefault();
          e.returnValue = '';
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode, quizScore]);

  // --- AUTH LOGIC ---
  // Autenticación deshabilitada - acceso directo
  
  const saveAttempt = (score: number, total: number, details: { question: string, category: string, isCorrect: boolean }[]) => {
    // Validar datos
    if (score < 0 || score > total || !details || details.length === 0) {
      console.error('Invalid attempt data:', { score, total, details });
      return;
    }
    
    const newAttempt: QuizAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      topic: quizTopic,
      score,
      total,
      details
    };
    setQuizHistory(prev => [...prev, newAttempt]);
    setQuizScore({ score, total });
    // Limpiar preguntas actuales para la siguiente sesión
    setCurrentQuestions(null);
  };

  // --- ASSISTANT LOGIC ---
  const handleAssistantSend = async () => {
    if (!assistantInput.trim() || isAssistantLoading) return;
    const userText = assistantInput;
    setAssistantInput('');
    setAssistantMessages(prev => [...prev, { role: 'user', text: userText, timestamp: new Date() }]);
    setIsAssistantLoading(true);
    try {
      const history = assistantMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const botText = await getChatWithNavigation(history, userText, (targetMode) => {
        setMode(targetMode);
        setQuizScore(null);
        setIsAssistantOpen(false);
      });
      setAssistantMessages(prev => [...prev, { role: 'model', text: botText || 'Error.', timestamp: new Date() }]);
    } catch (e) {
      setAssistantMessages(prev => [...prev, { role: 'model', text: 'Error.', timestamp: new Date() }]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const startQuiz = (topic?: string, selectedDifficulty?: Difficulty) => {
    (async () => {
      setIsPreparingQuiz(true);
      setQuizTopic(topic || "Examen Integral OS10 (Ley 21.659 y Res. 2183)");
      if (selectedDifficulty) setDifficulty(selectedDifficulty);
      setQuizScore(null);
      setQuizType('multiple');
      setIsSidebarOpen(false);
      try {
        const questions = await generateQuiz(topic || "Examen Integral OS10 (Ley 21.659 y Res. 2183)", [], selectedDifficulty || difficulty);
        setCurrentQuestions(questions);
        setMode(AppMode.EXAM);
      } catch (e) {
        console.error('Error preparando examen:', e);
        setCurrentQuestions(null);
        setMode(AppMode.EXAM);
      } finally {
        setIsPreparingQuiz(false);
      }
    })();
  };

  const startTrueFalseQuiz = (topic?: string, selectedDifficulty?: Difficulty) => {
    (async () => {
      setIsPreparingQuiz(true);
      setQuizTopic(topic || "Examen Verdadero/Falso General");
      if (selectedDifficulty) setDifficulty(selectedDifficulty);
      setQuizScore(null);
      setQuizType('trueFalse');
      setIsSidebarOpen(false);
      try {
        const mod = await import('./trueFalseDatabase');
        let pool = mod.TRUE_FALSE_DATABASE.slice();
        const isMini = (topic || '').toLowerCase().includes('módulo:');
        if (isMini) {
          const moduleName = (topic || '').split(':')[1]?.trim().toLowerCase() || '';
          if (moduleName) {
            pool = pool.filter((q: any) => q.category.toLowerCase().includes(moduleName) || q.question.toLowerCase().includes(moduleName));
          }
        }
        if (pool.length === 0) pool = mod.TRUE_FALSE_DATABASE.slice();
        pool = pool.sort(() => Math.random() - 0.5);
        setCurrentQuestions(pool);
        setMode(AppMode.TRUE_FALSE);
      } catch (e) {
        console.error('Error preparando V/F:', e);
        setCurrentQuestions(null);
        setMode(AppMode.TRUE_FALSE);
      } finally {
        setIsPreparingQuiz(false);
      }
    })();
  };

  if (!currentUser) {
    return null; // No mostrar pantalla de login
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-[200] w-72 bg-[#0f172a] text-white shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-shield-alt text-2xl"></i></div>
            <div className="flex flex-col"><h1 className="font-black text-xl tracking-tighter leading-none uppercase">OS10 2026</h1><span className="text-[9px] uppercase text-red-500 font-black tracking-widest">Instructor Maestro</span></div>
          </div>
          
          <nav className="flex-1 space-y-2">
            {[
              { id: AppMode.DASHBOARD, label: 'Panel Principal', icon: 'fa-home' },
              { id: AppMode.STUDY, label: 'Centro de Estudio', icon: 'fa-book-open' },
              { id: AppMode.TRUE_FALSE, label: 'Verdadero/Falso', icon: 'fa-question' },
              { id: AppMode.VISUAL, label: 'Simulador Visual', icon: 'fa-eye' },
              { id: AppMode.RESULTS, label: 'Mis Resultados', icon: 'fa-chart-pie' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { 
                  if (item.id === AppMode.TRUE_FALSE) {
                    startTrueFalseQuiz();
                  } else {
                    setMode(item.id); 
                    setQuizScore(null); 
                    setIsSidebarOpen(false); 
                  }
                }}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${mode === item.id ? 'bg-red-600 text-white shadow-xl translate-x-2' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
              >
                <i className={`fas ${item.icon} text-sm`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-72'}`}>
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] px-6 py-4 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
            <i className="fas fa-bars"></i>
          </button>
          <div className="hidden lg:block">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Estado de Operación: <span className="text-green-500">Sincronizado OS10</span></h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => startQuiz()} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg transition-all transform active:scale-95">Opción Múltiple</button>
            <button onClick={() => startTrueFalseQuiz()} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg transition-all transform active:scale-95">Verdadero/Falso</button>
            <button onClick={async () => {
              setDiagOpen(true);
              try {
                const res = await generateQuiz(quizTopic, [], difficulty);
                setDiagResult({ ok: true, count: res.length, sample: res.slice(0,3) });
              } catch (e) {
                setDiagResult({ ok: false, error: (e as any).message || String(e) });
              }
            }} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg transition-all">Diagnóstico</button>
          </div>
        </header>

        {diagOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-6">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black uppercase">Diagnóstico de carga de preguntas</h3>
                <button onClick={() => { setDiagOpen(false); setDiagResult(null); }} className="text-sm text-gray-500">Cerrar</button>
              </div>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-[60vh]">{JSON.stringify(diagResult, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="p-6 md:p-10">
          {mode === AppMode.DASHBOARD && (
            <div className="space-y-12 animate-fadeIn">
              <section className="bg-[#0f172a] text-white p-10 md:p-16 rounded-[50px] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-block bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-8 uppercase tracking-[0.2em]">Instructor Virtual 2026</span>
                  <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter italic leading-[0.85]">Domina la<br/>Seguridad Privada</h2>
                  <p className="text-gray-400 text-lg font-bold uppercase tracking-tight italic mb-10">Tu carrera como Guardia de Seguridad comienza aquí. Basado estrictamente en la Ley 21.659.</p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setMode(AppMode.STUDY)} className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-gray-100 transition-all">Ver Temarios</button>
                    <button onClick={() => startQuiz()} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-red-700 transition-all flex items-center gap-3">Examen M. Opción <i className="fas fa-play text-[8px]"></i></button>
                    <button onClick={() => startTrueFalseQuiz()} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3">Examen V/F <i className="fas fa-play text-[8px]"></i></button>
                  </div>
                </div>
                <i className="fas fa-shield-halved absolute -right-10 -bottom-10 text-[300px] text-white/5 rotate-12"></i>
              </section>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STUDY_MODULES.slice(0, 4).map((mod) => (
                  <div key={mod.id} onClick={() => setMode(AppMode.STUDY)} className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl transition-all border border-gray-100 group cursor-pointer">
                    <div className="w-14 h-14 bg-gray-50 text-red-600 rounded-[20px] flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all"><i className={`fas ${mod.icon} text-xl`}></i></div>
                    <h3 className="font-black text-gray-900 uppercase text-xs mb-2 italic">{mod.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">{mod.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === AppMode.STUDY && <StudyPortal difficulty={difficulty} setDifficulty={setDifficulty} onStartQuiz={startQuiz} onStartTrueFalse={startTrueFalseQuiz} />}
          {mode === AppMode.VISUAL && <VisualStudy />}
          {mode === AppMode.RESULTS && <ResultsView attempts={quizHistory} />}
          
          {mode === AppMode.EXAM && (
            <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
              {quizScore ? (
                <div className="bg-white p-16 rounded-[60px] shadow-2xl text-center border border-gray-100 max-w-xl mx-auto">
                  <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-8 text-5xl text-white ${quizScore.score >= quizScore.total * 0.7 ? 'bg-green-500 shadow-green-200' : 'bg-red-600 shadow-red-200'} shadow-2xl`}><i className={`fas ${quizScore.score >= quizScore.total * 0.7 ? 'fa-check' : 'fa-times'}`}></i></div>
                  <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">{quizScore.score >= quizScore.total * 0.7 ? '¡APROBADO!' : 'REPROBADO'}</h3>
                  <p className="text-gray-400 mb-12 text-sm font-black uppercase tracking-widest">Resultado Final: {quizScore.score} / {quizScore.total}</p>
                  <div className="flex gap-4">
                    <button onClick={() => startQuiz(quizTopic)} className="flex-1 bg-red-600 text-white py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Reintentar</button>
                    <button onClick={() => setMode(AppMode.RESULTS)} className="flex-1 bg-gray-900 text-white py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Ver Analítica</button>
                  </div>
                </div>
              ) : (
                <QuizView topic={quizTopic} difficulty={difficulty} onComplete={saveAttempt} initialQuestions={currentQuestions || undefined} isPreparing={isPreparingQuiz} />
              )}
            </div>
          )}

          {mode === AppMode.TRUE_FALSE && (
            <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
              {quizScore ? (
                <div className="bg-white p-16 rounded-[60px] shadow-2xl text-center border border-gray-100 max-w-xl mx-auto">
                  <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-8 text-5xl text-white ${quizScore.score >= quizScore.total * 0.7 ? 'bg-green-500 shadow-green-200' : 'bg-red-600 shadow-red-200'} shadow-2xl`}><i className={`fas ${quizScore.score >= quizScore.total * 0.7 ? 'fa-check' : 'fa-times'}`}></i></div>
                  <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">{quizScore.score >= quizScore.total * 0.7 ? '¡APROBADO!' : 'REPROBADO'}</h3>
                  <p className="text-gray-400 mb-12 text-sm font-black uppercase tracking-widest">Resultado Final: {quizScore.score} / {quizScore.total}</p>
                  <div className="flex gap-4">
                    <button onClick={() => startTrueFalseQuiz(quizTopic)} className="flex-1 bg-red-600 text-white py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Reintentar</button>
                    <button onClick={() => setMode(AppMode.RESULTS)} className="flex-1 bg-gray-900 text-white py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Ver Analítica</button>
                  </div>
                </div>
              ) : (
                <TrueFalseView topic={quizTopic} difficulty={difficulty} onComplete={saveAttempt} initialQuestions={currentQuestions || undefined} isPreparing={isPreparingQuiz} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* FLOAT BOT */}
      <div className="fixed bottom-8 right-8 z-[150]">
        {!isAssistantOpen ? (
          <button onClick={() => setIsAssistantOpen(true)} className="w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"><i className="fas fa-robot text-xl"></i></button>
        ) : (
          <div className="w-[350px] bg-white rounded-[40px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fadeIn h-[500px]">
             <div className="p-6 bg-[#0f172a] text-white flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-[0.2em]">IA de Seguridad 2026</span><button onClick={() => setIsAssistantOpen(false)}><i className="fas fa-times"></i></button></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 no-scrollbar">
              {assistantMessages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-4 rounded-3xl text-[11px] font-bold italic shadow-sm ${m.role === 'user' ? 'bg-red-600 text-white' : 'bg-white border text-gray-700'}`}>{m.text}</div></div>))}
              {isAssistantLoading && <div className="p-4 bg-white border rounded-3xl animate-pulse text-[10px] font-black text-gray-400">Analizando Leyes...</div>}
            </div>
            <div className="p-6 bg-white border-t flex gap-3"><input value={assistantInput} onChange={e => setAssistantInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAssistantSend()} placeholder="Consultar leyes..." className="flex-1 p-4 bg-gray-100 rounded-2xl text-[11px] font-bold focus:outline-none" /><button onClick={handleAssistantSend} className="w-12 h-12 bg-red-600 text-white rounded-2xl shadow-lg flex items-center justify-center"><i className="fas fa-paper-plane text-xs"></i></button></div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
