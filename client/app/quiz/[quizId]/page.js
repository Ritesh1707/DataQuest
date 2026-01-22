"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizPage({ params }) {
  const { quizId } = params;
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getQuiz(quizId);
        setQuiz(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId]);

  const handleSelect = (qId, option) => {
    if (result) return; // Disable changes after submit
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    try {
      const res = await api.submitQuiz(quizId, answers);
      setResult(res);
      if (res.percentage >= 70) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error(e);
      alert('Failed to submit quiz');
    }
  };

  if (loading) return <div className="min-h-screen bg-[var(--deep-space)] flex items-center justify-center text-white">Loading Mission...</div>;
  if (!quiz) return <div className="min-h-screen bg-[var(--deep-space)] flex items-center justify-center text-white">Quiz not found</div>;

  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white selection:bg-brick selection:text-white pb-20">
      <Navbar />
      
      <div className="pt-28 px-6 max-w-3xl mx-auto">
        <div className="mb-8 border-b border-white/10 pb-6">
           <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-widest ${
                 quiz.difficulty === 'BEGINNER' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                 quiz.difficulty === 'INTERMEDIATE' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {quiz.difficulty} Protocol
              </span>
           </div>
           <h1 className="text-4xl font-light mb-4">{quiz.title}</h1>
           <p className="text-slate-400 text-lg font-light">{quiz.description}</p>
        </div>

        {result && (
           <div className={`mb-8 p-6 rounded-2xl border ${result.percentage >= 70 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} flex items-center justify-between`}>
              <div>
                 <h2 className={`text-2xl font-bold mb-1 ${result.percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.percentage >= 70 ? 'Mission Accomplished!' : 'Mission Failed'}
                 </h2>
                 <p className="text-slate-300">You scored {result.score} / {result.maxScore} ({Math.round(result.percentage)}%)</p>
                 {result.xpAwarded > 0 && (
                    <div className="flex items-center text-yellow-400 mt-2 font-bold gap-2">
                       <Award className="w-5 h-5" /> +{result.xpAwarded} XP Earned
                    </div>
                 )}
              </div>
              <div className="text-4xl font-bold opacity-50">
                 {Math.round(result.percentage)}%
              </div>
           </div>
        )}

        <div className="space-y-8">
           {quiz.questions.map((q, idx) => {
             const resultData = result?.results?.find(r => r.questionId === q.id);
             
             return (
               <div key={q.id} className="glass-panel p-6 rounded-2xl border border-white/5">
                 <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-medium text-slate-200">
                       <span className="text-slate-500 mr-2">{idx + 1}.</span> {q.text}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono border border-slate-700 px-2 py-0.5 rounded">{q.points} PTS</span>
                 </div>

                 <div className="space-y-3">
                    {q.options.map((option) => {
                       const isSelected = answers[q.id] === option;
                       const isCorrect = resultData?.correctAnswer === option;
                       const isWrong = resultData && isSelected && !resultData.isCorrect;
                       
                       let bgClass = "bg-slate-800/50 hover:bg-slate-700/50 border-transparent";
                       if (isSelected) bgClass = "bg-brick/20 border-brick text-white";
                       
                       if (result) {
                          if (isCorrect) bgClass = "bg-green-500/20 border-green-500 text-green-300";
                          else if (isWrong) bgClass = "bg-red-500/20 border-red-500 text-red-300";
                          else bgClass = "opacity-50";
                       }

                       return (
                         <button
                           key={option}
                           onClick={() => handleSelect(q.id, option)}
                           disabled={!!result}
                           className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${bgClass}`}
                         >
                           <span>{option}</span>
                           {result && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                           {result && isWrong && <XCircle className="w-5 h-5 text-red-400" />}
                         </button>
                       )
                    })}
                 </div>
                 
                 {resultData && resultData.explanation && (resultData.isCorrect || !resultData.isCorrect) && (
                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg text-blue-300 text-sm">
                       <strong>Insight:</strong> {resultData.explanation || "Review the lesson materials."}
                    </div>
                 )}
               </div>
             )
           })}
        </div>

        {!result && (
           <div className="mt-12 flex justify-end">
              <button 
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions.length}
                className="bg-brick hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-brick/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Submit Answers <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        )}
      </div>
    </div>
  );
}
