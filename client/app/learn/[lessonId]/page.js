'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Play, CheckCircle, AlertCircle, ChevronLeft, Code, Trophy, terminal, RotateCcw, X, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export default function LessonPage() {
  const { lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null); 
  const [submitting, setSubmitting] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getLesson(lessonId);
        setLesson(data);
        if (data.exercises && data.exercises.length > 0) {
          setCode(data.exercises[0].starterCode || '// Type your code here');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lessonId]);

  const runCode = async () => {
    if (!lesson || !lesson.exercises[0]) return;
    
    setSubmitting(true);
    setOutput(null);
    setIsConsoleOpen(true);

    const exerciseId = lesson.exercises[0].id;

    try {
      const result = await api.submitExercise(exerciseId, code);
      setOutput(result);
      
      if (result.success) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF3621', '#ffffff', '#FF9A8B']
        });
      }
    } catch (e) {
      setOutput({ success: false, message: e.message || 'Execution Error' });
    } finally {
      setSubmitting(false);
    }
  };

  const analyzeCode = async () => {
    if (!code) return;
    setAnalyzing(true);
    try {
      const data = await api.analyzeCode(code, lesson.exercises[0].prompt);
      setAiFeedback(data.feedback);
    } catch (e) {
      setAiFeedback("Error analyzing code. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return (
     <div className="h-screen w-full bg-[var(--deep-space)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brick"></div>
     </div>
  );
  
  if (!lesson) return <div className="text-white">Lesson not found</div>;

  return (
    <div className="h-screen flex flex-col bg-[#0B1016] text-white overflow-hidden">
      {/* Mini Header */}
      <div className="h-14 bg-[#0A0E12] border-b border-white/5 flex items-center justify-between px-4 z-20">
         <div className="flex items-center">
            <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg mr-2 transition-colors">
               <ChevronLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
               <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">MODULE: {lesson.module?.title || 'LEARNING'}</div>
               <div className="font-bold text-sm text-slate-200">{lesson.title}</div>
            </div>
         </div>
         
         <div className="flex items-center space-x-3">
             <div className="px-3 py-1 bg-blue-900/20 text-blue-400 text-xs font-bold rounded border border-blue-500/20 flex items-center">
                <Code className="w-3 h-3 mr-2" /> Interactive Lab
             </div>
         </div>
      </div>

      {/* Success Overlay */}
      {output?.newBadge && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-[#141414] p-10 rounded-3xl border border-yellow-500/20 shadow-[0_0_100px_rgba(234,179,8,0.2)] text-center max-w-md w-full mx-4 transform animate-slide-up relative overflow-hidden">
             
             {/* Shine Effect */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none" />

             <div className="relative z-10">
                 <div className="inline-block p-6 rounded-full bg-yellow-500/10 mb-6 ring-1 ring-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <Trophy className="w-16 h-16 text-yellow-400" />
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-2">Badge Unlocked!</h2>
                 <div className="text-xl font-bold text-yellow-500 mb-6 font-mono tracking-wide">
                   {output.newBadge.name}
                 </div>
                 <p className="text-slate-400 mb-8 leading-relaxed text-sm">{output.newBadge.description}</p>
                 <button 
                   onClick={() => setOutput({...output, newBadge: null})} 
                   className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all transform hover:scale-[1.02]"
                 >
                   Continue Learning
                 </button>
             </div>
          </div>
        </div>
      )}

      {/* AI Feedback Overlay */}
      {aiFeedback && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in" onClick={() => setAiFeedback(null)}>
          <div className="bg-[#141414] w-full max-w-2xl mx-4 rounded-xl border border-purple-500/20 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
             <div className="p-4 border-b border-white/5 bg-purple-900/10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-purple-400 font-bold">
                   <Sparkles className="w-5 h-5" />
                   <span>CodeSensei Feedback</span>
                </div>
                <button onClick={() => setAiFeedback(null)} className="text-slate-400 hover:text-white">
                   <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-6 overflow-y-auto custom-scrollbar prose prose-invert max-w-none">
                <ReactMarkdown>{aiFeedback}</ReactMarkdown>
             </div>
             <div className="p-4 border-t border-white/5 bg-[#0A0E12] flex justify-end">
                <button onClick={() => setAiFeedback(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                   Close
                </button>
             </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Content */}
        <div className="w-[40%] flex flex-col border-r border-white/5 bg-[#0B1016]">
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="prose prose-invert max-w-none">
               <style jsx global>{`
                  .prose h1 { color: #f8fafc; font-size: 2.25rem; font-weight: 700; letter-spacing: -0.025em; margin-bottom: 1.5rem; line-height: 1.1; }
                  .prose h2 { color: #f1f5f9; font-size: 1.5rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
                  .prose h3 { color: #e2e8f0; font-size: 1.25rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; }
                  .prose p { color: #94a3b8; line-height: 1.8; font-size: 1rem; margin-bottom: 1.25rem; }
                  .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; color: #94a3b8; }
                  .prose li { margin-bottom: 0.5rem; }
                  .prose strong { color: #e2e8f0; font-weight: 600; }
                  .prose pre { background: #111418; border: 1px solid #2d333b; border-radius: 0.75rem; padding: 1rem; margin: 1.5rem 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                  .prose code { color: #FF9A8B; background: rgba(255, 54, 33, 0.08); padding: 0.2em 0.4em; rounded: 0.25em; font-size: 0.875em; font-family: var(--font-mono); }
                  .prose pre code { color: #cbd5e1; background: transparent; padding: 0; font-size: 0.9em; }
                  .prose blockquote { border-left-color: #FF3621; background: rgba(255, 54, 33, 0.05); color: #cbd5e1; font-style: normal; border-radius: 0 0.5rem 0.5rem 0; padding: 1rem; margin: 1.5rem 0; }
               `}</style>
               <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>

            {lesson.exercises && lesson.exercises.length > 0 && (
               <div className="mt-12 mb-8">
                  <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-slate-900 shadow-lg">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Code className="w-24 h-24 text-blue-500" />
                     </div>
                     
                     <div className="relative p-6">
                        <div className="flex items-center space-x-2 text-blue-400 mb-4">
                           <div className="p-1.5 bg-blue-500/20 rounded-lg">
                              <Code className="w-5 h-5" />
                           </div>
                           <h3 className="text-sm font-bold uppercase tracking-widest">Coding Challenge</h3>
                        </div>
                        
                        <div className="text-slate-200 text-base leading-relaxed font-light">
                           <ReactMarkdown>{lesson.exercises[0].prompt}</ReactMarkdown>
                        </div>
                     </div>
                  </div>
               </div>
            )}
            
            {/* Footer Spacer */}
            <div className="h-20" />
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
          
          {/* Editor Header */}
          <div className="h-10 bg-[#252526] flex items-center justify-between px-4 border-b border-[#333]">
             <div className="text-xs text-slate-400 font-mono">main.py</div>
             <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCode(lesson.exercises[0].starterCode)} 
                  className="p-1.5 hover:bg-white/10 rounded text-slate-400"
                  title="Reset Code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
             </div>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Geist Mono', monospace",
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3
              }}
            />
          </div>

          {/* Console / Output Area */}
          <div className={`transition-all duration-300 border-t border-[#333] bg-[#0A0E12] flex flex-col ${isConsoleOpen ? 'h-1/3' : 'h-10'}`}>
             <div className="flex items-center justify-between p-2 pl-4 bg-[#18181b] border-b border-[#333] cursor-pointer" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
               <span className="text-xs font-mono text-slate-400 font-bold flex items-center">
                 TERMINAL {output && !output.success && <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
               </span>
               <div className="flex items-center space-x-3">
                 <button 
                    onClick={(e) => { e.stopPropagation(); runCode(); }}
                    disabled={submitting}
                    className="flex items-center px-5 py-1 bg-green-700 hover:bg-green-600 text-white rounded-md text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
                 >
                   {submitting ? 'Creating Cluster...' : (
                     <>
                       <Play className="w-3 h-3 mr-2" fill="currentColor" /> RUN
                     </>
                   )}
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); setIsConsoleOpen(false); }} className="hover:text-white text-slate-500">
                    <X className="w-4 h-4" />
                 </button>
               </div>
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-[#0C1015]">
                {!output && <div className="text-slate-600 italic text-xs">// Output will appear here...</div>}
                
                {output && (
                  <div className={`flex items-start animate-fade-in ${output.success ? 'text-green-400' : 'text-red-400'}`}>
                    {output.success ? <CheckCircle className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />}
                    <div>
                      <div className="font-bold mb-1">{output.success ? 'Execution Successful' : 'Execution Failed'}</div>
                      <div className="text-slate-300 whitespace-pre-wrap leading-relaxed opacity-90">{output.message}</div>
                      {output.xpEarned > 0 && (
                        <div className="mt-3 inline-flex items-center px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 text-xs font-bold">
                           <Zap className="w-3 h-3 mr-1" fill="currentColor"/> + {output.xpEarned} XP
                        </div>
                      )}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
