import { Code as CodeIcon, Terminal, Copy } from 'lucide-react';

export const CodeViewer = ({ content, filename }: { content: string; filename: string }) => {
  const lines = content.split('\n');

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white/[0.02] border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <CodeIcon size={16} className="text-brand-400" />
          </div>
          <span className="text-sm font-bold text-slate-300">{filename}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
            {lines.length} Lines
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <Copy size={16} />
          </button>
        </div>
      </div>
      
      <div className="relative font-mono text-sm overflow-x-auto bg-dark-950/40">
        <div className="flex min-w-full">
          {/* Line Numbers */}
          <div className="flex-none w-14 py-4 text-right pr-4 text-slate-700 select-none bg-white/[0.01] border-r border-white/5">
            {lines.map((_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
          
          {/* Code Content */}
          <pre className="flex-1 py-4 px-6 text-slate-300 leading-relaxed">
            <code>
              {content || <span className="italic text-slate-600">// No content</span>}
            </code>
          </pre>
        </div>
      </div>

      <div className="bg-white/[0.02] border-t border-white/5 px-6 py-2 flex items-center justify-end">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
          <Terminal size={10} />
          <span>UTF-8</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>LF</span>
        </div>
      </div>
    </div>
  );
};

