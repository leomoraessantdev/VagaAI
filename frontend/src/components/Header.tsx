export function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center shrink-0 rotate-3">
            <span className="text-paper font-display font-bold text-lg leading-none -rotate-3">
              V
            </span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Vaga<span className="text-accent">AI</span>
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] text-ink-faint border border-line rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Llama 3.3 via Groq
        </span>
      </div>
    </header>
  );
}
