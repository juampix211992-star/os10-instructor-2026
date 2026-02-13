
import React, { useState } from 'react';
import { STUDY_CONTENT } from '../constants';
import ChatView from './ChatView';
import { Difficulty } from '../types';

interface StudyPortalProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  onStartQuiz: (topic: string, diff?: Difficulty) => void;
  onStartTrueFalse: (topic: string, diff?: Difficulty) => void;
}

const StudyPortal: React.FC<StudyPortalProps> = ({ difficulty, setDifficulty, onStartQuiz, onStartTrueFalse }) => {
  const [selectedId, setSelectedId] = useState<string>(STUDY_CONTENT[0].id);
  const [openMaterialIdx, setOpenMaterialIdx] = useState<number | null>(null);
  
  const selectedModule = STUDY_CONTENT.find(m => m.id === selectedId) || STUDY_CONTENT[0];

  const handleToggleMaterial = (idx: number) => {
    setOpenMaterialIdx(openMaterialIdx === idx ? null : idx);
  };

  return (
    <div className="flex flex-col space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Navegación por Pestañas Superior */}
      <div className="bg-white p-3 rounded-[30px] border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {STUDY_CONTENT.map((mod) => (
            <button
              key={mod.id}
              onClick={() => { setSelectedId(mod.id); setOpenMaterialIdx(null); }}
              className={`px-5 py-3.5 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-3 ${
                selectedId === mod.id 
                  ? 'bg-red-600 text-white shadow-xl' 
                  : 'bg-transparent text-gray-400 hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${mod.icon}`}></i>
              {mod.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[45px] border border-gray-100 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Cabecera del Módulo */}
            <div className="p-8 md:p-12 bg-gray-50/50 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0f172a] text-white rounded-[20px] flex items-center justify-center shadow-2xl">
                    <i className={`fas ${selectedModule.icon} text-2xl`}></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Sección Informativa</span>
                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none italic">{selectedModule.title}</h3>
                  </div>
                </div>
                
                {/* Control Dificultad Mini-Examen */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 text-center md:text-right">Dificultad Examen:</span>
                  <div className="flex bg-gray-200 p-1 rounded-xl">
                    {[Difficulty.LOW, Difficulty.MEDIUM, Difficulty.HIGH].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                          difficulty === d 
                            ? 'bg-red-600 text-white shadow-md' 
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onStartQuiz(`Módulo: ${selectedModule.title}`, difficulty)}
                      className="flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-black text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 group"
                    >
                      <i className="fas fa-vial group-hover:animate-bounce"></i>
                      Opción Múltiple (15)
                    </button>
                    <button 
                      onClick={() => onStartTrueFalse(`Módulo: ${selectedModule.title}`, difficulty)}
                      className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 group"
                    >
                      <i className="fas fa-question-circle group-hover:animate-bounce"></i>
                      Verdadero/Falso (20)
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 font-bold leading-relaxed border-l-8 border-red-600 pl-8 uppercase tracking-tight italic">
                {selectedModule.explanation}
              </p>
            </div>

            <div className="p-8 md:p-10 space-y-10">
              {/* ACORDEÓN CAJA ROJA */}
              <section className="bg-red-600 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <i className="fas fa-star text-lg"></i>
                    </div>
                    <h4 className="text-base font-black uppercase tracking-widest leading-tight italic">
                      ¡LO MÁS RELEVANTE PARA<br/>EL EXAMEN!
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedModule.materials.map((item, idx) => (
                      <div key={idx} className="flex flex-col bg-white/10 rounded-3xl border border-white/5 overflow-hidden transition-all duration-300">
                        <button 
                          onClick={() => handleToggleMaterial(idx)}
                          className="flex items-start gap-4 p-5 hover:bg-white/10 transition-colors w-full text-left focus:outline-none"
                        >
                          <i className={`fas fa-check-double text-red-300 mt-1 transition-transform ${openMaterialIdx === idx ? 'scale-125 rotate-6' : ''}`}></i>
                          <span className="text-[13px] font-black uppercase tracking-tight leading-tight flex-1">
                            {item.title}
                          </span>
                          <i className={`fas fa-chevron-down text-[10px] mt-1.5 transition-transform duration-300 ${openMaterialIdx === idx ? 'rotate-180' : 'rotate-0'}`}></i>
                        </button>
                        
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          openMaterialIdx === idx ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="p-6 pt-0 text-[12px] font-bold leading-relaxed text-white/90 border-t border-white/5 bg-black/10 italic">
                            {item.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Base Técnica */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-[#0f172a] text-white rounded-xl flex items-center justify-center">
                    <i className="fas fa-book text-sm"></i>
                  </div>
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Base Técnica Completa</h4>
                </div>
                <div className="space-y-4">
                  {selectedModule.detailedContent.split('\n\n').map((para, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-[25px] border border-gray-200 italic shadow-inner">
                      <p className="text-[13px] font-bold leading-relaxed text-gray-700 uppercase tracking-tight">
                        {para}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Casos Prácticos */}
              <section className="grid md:grid-cols-2 gap-6">
                {selectedModule.examples.map((ex, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-100 rounded-[35px] shadow-lg overflow-hidden flex flex-col">
                    <div className="p-5 bg-[#0f172a] text-white">
                      <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-2">Escenario</span>
                      <p className="text-xs font-black uppercase italic leading-tight">"{ex.case}"</p>
                    </div>
                    <div className="p-6 flex-grow bg-gray-50/50">
                      <div className="flex items-center gap-2 text-red-600 mb-3">
                        <i className="fas fa-shield-halved text-xs"></i>
                        <span className="text-[9px] font-black uppercase tracking-widest">Acción OS10:</span>
                      </div>
                      <p className="text-xs text-gray-800 font-bold leading-snug italic">
                        {ex.action}
                      </p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>

        {/* Sidebar Informativo */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0f172a] text-white p-8 rounded-[40px] border border-white/5 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-600 rounded-full mx-auto flex items-center justify-center shadow-2xl border-4 border-white/10 mb-6">
                <i className="fas fa-robot text-3xl"></i>
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-red-500">Instructor Virtual 2026</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 italic">Consultas Legales al Instante</p>
            </div>
            <ChatView />
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-center space-y-6">
            <i className="fas fa-graduation-cap text-3xl text-red-600"></i>
            <h5 className="text-lg font-black uppercase italic tracking-tighter">¿Listo para Evaluarte?</h5>
            <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight">
              Prueba tus conocimientos sobre {selectedModule.title}.
            </p>
            <div className="space-y-3">
              <button onClick={() => onStartQuiz(`Módulo: ${selectedModule.title}`, difficulty)} className="w-full bg-[#0f172a] hover:bg-black text-white py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95">
                Opción Múltiple
              </button>
              <button onClick={() => onStartTrueFalse(`Módulo: ${selectedModule.title}`, difficulty)} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95">
                Verdadero/Falso
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default StudyPortal;
