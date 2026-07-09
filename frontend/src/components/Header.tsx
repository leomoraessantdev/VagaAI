export function Header() {
  return (
    <header className="bg-[#1563D3] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0">
          <span className="text-[#1563D3] font-bold text-lg leading-none">V</span>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none">VagaAI</h1>
          <p className="text-blue-100 text-xs mt-0.5">
            Descrições de vagas profissionais em segundos
          </p>
        </div>
      </div>
    </header>
  );
}
