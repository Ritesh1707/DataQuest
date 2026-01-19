'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, AlertCircle, ChevronRight, Code, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null); // { success, message, xpEarned }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getLesson(lessonId);
        setLesson(data);
        // Pre-fill editor with first exercise starter code
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

    const exerciseId = lesson.exercises[0].id; // Assuming one exercise per lesson for now

    try {
      const result = await api.submitExercise(exerciseId, code);
      setOutput(result);
      
      if (result.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      setOutput({ success: false, message: e.message || 'Execution Error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!lesson) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Lesson not found</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      <Navbar />
      
      {output?.newBadge && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-slate-900 p-8 rounded-2xl border-2 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)] text-center max-w-sm w-full mx-4 transform scale-100 animate-in zoom-in duration-300">
             <div className="inline-block p-4 rounded-full bg-yellow-900/30 mb-4 ring-1 ring-yellow-500/50">
                <Trophy className="w-16 h-16 text-yellow-400" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">Badge Unlocked!</h2>
             <div className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent mb-4">
               {output.newBadge.name}
             </div>
             <p className="text-slate-400 mb-8">{output.newBadge.description}</p>
             <button 
               onClick={() => setOutput({...output, newBadge: null})} 
               className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
             >
               Awesome!
             </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Content */}
        <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/50">
          <div className="p-6 overflow-y-auto flex-1">
            <h1 className="text-2xl font-bold mb-4 text-blue-100">{lesson.title}</h1>
            <div className="prose prose-invert prose-blue max-w-none">
              <div className="whitespace-pre-wrap text-slate-300 font-sans leading-relaxed">
                  {lesson.content}
              </div>
            </div>

            {lesson.exercises && lesson.exercises.length > 0 && (
               <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2" /> Challenge
                  </h3>
                  <p className="text-slate-200">{lesson.exercises[0].prompt}</p>
               </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-900">
             <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Module: {lesson.module?.title || 'Basics'}</span>
                <span>Step {lesson.order}</span>
             </div>
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 20 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Console / Output Area */}
          <div className="h-48 border-t border-slate-800 bg-slate-900 flex flex-col">
             <div className="flex items-center justify-between p-2 px-4 border-b border-slate-800 bg-slate-950">
               <span className="text-xs font-mono text-slate-400">CONSOLE</span>
               <button 
                  onClick={runCode}
                  disabled={submitting}
                  className="flex items-center px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
               >
                 {submitting ? 'Running...' : (
                   <>
                     <Play className="w-3 h-3 mr-2" fill="currentColor" /> Run Code
                   </>
                 )}
               </button>
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                {!output && <span className="text-slate-600 italic">Run code to see output...</span>}
                
                {output && (
                  <div className={`flex items-start ${output.success ? 'text-green-400' : 'text-red-400'}`}>
                    {output.success ? <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
                    <div>
                      <div className="font-bold mb-1">{output.success ? 'Success!' : 'Failed'}</div>
                      <div>{output.message}</div>
                      {output.xpEarned > 0 && (
                        <div className="mt-2 text-yellow-400 text-xs font-bold">+ {output.xpEarned} XP Earned</div>
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
