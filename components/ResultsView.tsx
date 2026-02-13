
import React from 'react';
import { QuizAttempt, CategoryStat } from '../types';

interface ResultsViewProps {
  attempts: QuizAttempt[];
}

const ResultsView: React.FC<ResultsViewProps> = ({ attempts }) => {
  // Calcular estadísticas por categoría
  const categoryMap: Record<string, { correct: number; total: number }> = {};
  
  attempts.forEach(attempt => {
    attempt.details.forEach(detail => {
      if (!categoryMap[detail.category]) {
        categoryMap[detail.category] = { correct: 0, total: 0 };
      }
      categoryMap[detail.category].total += 1;
      if (detail.isCorrect) categoryMap[detail.category].correct += 1;
    });
  });

  const stats: CategoryStat[] = Object.entries(categoryMap)
    .map(([category, data]) => ({
      category,
      correct: data.correct,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const totalExams = attempts.length;
  const avgScore = totalExams > 0 && attempts.every(a => a.total > 0)
    ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalExams * 100) 
    : 0;

  if (totalExams === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-[40px] border border-gray-100 shadow-xl animate-fadeIn">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <i className="fas fa-chart-line text-3xl"></i>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-gray-900">Sin Datos Disponibles</h2>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Realiza un examen para comenzar a trackear tu rendimiento técnico.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Resumen General */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] p-8 rounded-[40px] text-white shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Promedio de Aptitud</span>
            <div className="text-5xl font-black italic tracking-tighter mt-2">{avgScore}%</div>
            <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase">Meta OS10: 70% para aprobación</p>
          </div>
          <i className="fas fa-award absolute -right-4 -bottom-4 text-7xl opacity-10"></i>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            <i className="fas fa-file-signature"></i>
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Simulacros Completos</span>
            <div className="text-3xl font-black text-gray-900 italic tracking-tighter">{totalExams}</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dominio Principal</span>
            <div className="text-xl font-black text-gray-900 italic tracking-tighter uppercase">{stats[0]?.category || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Desglose por Categoría */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[45px] shadow-2xl border border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center">
              <i className="fas fa-list-check mr-3 text-red-600"></i> Análisis por Área de Conocimiento
            </h3>
            <div className="space-y-8">
              {stats.map((s, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-tight text-gray-900">{s.category}</span>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{s.correct} de {s.total} correctas</p>
                    </div>
                    <span className={`text-sm font-black italic ${s.percentage >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                      {s.percentage}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ${s.percentage >= 70 ? 'bg-green-500' : 'bg-red-600'}`} 
                      style={{ width: `${s.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historial de Intentos */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f172a] text-white p-8 md:p-10 rounded-[45px] shadow-2xl border border-white/5 h-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-8">Historial de Operaciones</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
              {attempts.slice().reverse().map((att, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-500 uppercase">{new Date(att.date).toLocaleDateString()}</p>
                    <p className="text-xs font-black uppercase italic tracking-tighter truncate max-w-[150px]">{att.topic}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-[10px] font-black tracking-tighter ${att.score / att.total >= 0.7 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                    {att.score}/{att.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
