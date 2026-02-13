import React, { useState, useEffect } from 'react';
import { Difficulty } from '../types';
import { TRUE_FALSE_DATABASE } from '../trueFalseDatabase';

interface TrueFalseViewProps {
  topic: string;
  difficulty?: Difficulty;
  excludeQuestions?: string[];
  onComplete: (score: number, total: number, details: { question: string, category: string, isCorrect: boolean }[]) => void;
}

const TrueFalseView: React.FC<TrueFalseViewProps> = ({ topic, difficulty = Difficulty.MEDIUM, excludeQuestions = [], onComplete }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [quizDetails, setQuizDetails] = useState<{ question: string, category: string, isCorrect: boolean }[]>([]);
  
  const isMiniExam = topic.toLowerCase().includes('módulo:');

  useEffect(() => {
    try {
      // Filtrar por dificultad y tema
      let filtered = TRUE_FALSE_DATABASE.filter(q => !excludeQuestions.includes(q.id));
      
      if (isMiniExam) {
        const moduleName = topic.split(':')[1].trim().toLowerCase();
        filtered = filtered.filter(q => 
          q.category.toLowerCase().includes(moduleName) || 
          q.question.toLowerCase().includes(moduleName)
        );
      }

      // Si no hay suficientes preguntas, tomar todo lo disponible
      if (filtered.length === 0) {
        filtered = TRUE_FALSE_DATABASE.filter(q => !excludeQuestions.includes(q.id));
      }

      if (filtered.length === 0) {
        setError('No hay preguntas disponibles para este módulo');
        setQuestions([]);
        return;
      }

      // Mezclar preguntas
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      console.debug('[TrueFalseView] questions loaded:', shuffled.length, shuffled.slice(0,3));
      setQuestions(shuffled);
      setError(null);
    } catch (err) {
      console.error('Error al cargar preguntas V/F:', err);
      setError('Error al cargar las preguntas. Intenta de nuevo. (' + (err && (err as any).message ? (err as any).message : String(err)) + ')');
      setQuestions([]);
    }
  }, [topic, excludeQuestions]);

  const handleFinish = (finalScore: number, total: number, details: { question: string, category: string, isCorrect: boolean }[]) => {
    onComplete(finalScore, total, details);
  };

  const handleSelect = (answer: boolean) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    
    const currentQ = questions[currentIndex];
    const correct = selectedAnswer === currentQ.isTrue;
    
    const newDetail = {
      question: currentQ.question,
      category: currentQ.category,
      isCorrect: correct
    };

    setQuizDetails(prev => [...prev, newDetail]);
    if (correct) setScore(prev => prev + 1);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      handleFinish(score, questions.length, quizDetails);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-4xl">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="text-center space-y-3">
          <p className="text-gray-900 font-black uppercase text-sm tracking-widest">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
          >
            Reintentar Cargar
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-4xl">
          <i className="fas fa-inbox"></i>
        </div>
        <div className="text-center space-y-3">
          <p className="text-gray-900 font-black uppercase text-sm tracking-widest">No hay preguntas disponibles</p>
          <p className="text-gray-400 font-bold text-[10px] uppercase">Intenta con otro módulo o dificultad</p>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const isCorrect = isAnswered && selectedAnswer === q.isTrue;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-[45px] shadow-2xl border border-gray-100 animate-fadeIn relative overflow-hidden">

      <div className="mb-10">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] block">Examen Verdadero/Falso</span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{difficulty}</span>
              <span className="text-gray-400 font-bold text-xs">/ {questions.length} PREGUNTAS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Progreso: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="mb-10">
        <div className="inline-block bg-gray-100 text-gray-500 text-[9px] font-black uppercase px-3 py-1 rounded-full mb-4 tracking-widest">
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none tracking-tighter uppercase italic">
          {q.question}
        </h2>
      </div>

      <div className="space-y-4 mb-10">
        {[
          { value: true, label: 'VERDADERO', color: 'green' },
          { value: false, label: 'FALSO', color: 'red' }
        ].map((option) => {
          let styles = "p-8 border-2 rounded-[30px] cursor-pointer transition-all flex items-center space-x-4 ";
          
          if (isAnswered) {
            if (option.value === q.isTrue) {
              styles += "border-green-500 bg-green-50 shadow-xl ";
            } else if (option.value === selectedAnswer) {
              styles += "border-red-500 bg-red-50 ";
            } else {
              styles += "border-gray-50 opacity-40 ";
            }
          } else {
            if (selectedAnswer === option.value) {
              styles += `border-${option.color}-600 bg-${option.color}-50 shadow-xl scale-[1.03] z-10 `;
            } else {
              styles += "border-gray-100 hover:border-gray-200 hover:bg-gray-50 ";
            }
          }

          return (
            <div 
              key={String(option.value)} 
              onClick={() => handleSelect(option.value)} 
              className={styles}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedAnswer === option.value 
                  ? (isAnswered 
                      ? (option.value === q.isTrue ? 'border-green-600 bg-green-600' : 'border-red-600 bg-red-600') 
                      : `border-${option.color}-600 bg-${option.color}-600 scale-110`) 
                  : 'border-gray-200'
              }`}>
                {(selectedAnswer === option.value || (isAnswered && option.value === q.isTrue)) && 
                  <i className={`fas ${option.value === q.isTrue ? 'fa-check' : 'fa-times'} text-xs text-white`}></i>
                }
              </div>
              <span className="text-xl font-black text-gray-800">{option.label}</span>
            </div>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`mb-10 p-10 bg-gray-900 rounded-[40px] shadow-2xl animate-fadeIn border-t-8 ${isCorrect ? 'border-green-500' : 'border-red-600'} relative overflow-hidden`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${isCorrect ? 'bg-green-600' : 'bg-red-600'} text-white rounded-xl flex items-center justify-center shadow-lg`}>
                  <i className={`fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'} text-sm`}></i>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Respuesta Correcta' : 'Respuesta Incorrecta'}
                  </p>
                  <p className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Fundamentación Legal OS10:</p>
                </div>
              </div>
            </div>
            <p className="text-[15px] text-gray-300 font-bold leading-relaxed italic border-l-4 border-gray-700 pl-6">
              {q.explanation}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {!isAnswered ? (
          <button 
            disabled={selectedAnswer === null}
            onClick={handleConfirm}
            className={`flex-1 py-5 rounded-[25px] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl ${
              selectedAnswer === null 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-[1.02] active:scale-95'
            }`}
          >
            Confirmar Respuesta
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex-1 py-5 bg-gray-900 hover:bg-black text-white rounded-[25px] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            {currentIndex + 1 < questions.length ? (
              <>Siguiente <i className="fas fa-arrow-right text-[10px]"></i></>
            ) : (
              <>Finalizar <i className="fas fa-flag-checkered"></i></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrueFalseView;
