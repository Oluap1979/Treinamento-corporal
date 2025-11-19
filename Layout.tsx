
import React from 'react';
import { Home, BarChart2, User, PlusCircle } from 'lucide-react';
import { ViewState } from './types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  const isImmersive = currentView === ViewState.WORKOUT_PLAYER || currentView === ViewState.ONBOARDING;
  const whatsappLink = "https://wa.me/5583999385147";

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-aura-dark text-white shadow-2xl relative overflow-hidden font-sans selection:bg-aura-mint selection:text-aura-dark">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-aura-dark to-aura-dark pointer-events-none -z-10" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-aura-light/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-aura-mint/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <main className={`flex-1 overflow-y-auto z-10 scroll-smooth flex flex-col ${!isImmersive ? 'pb-28' : 'pb-0'}`}>
        <div className="flex-1 relative animate-fade-in">
          {children}
        </div>

        {/* Global Developer Footer */}
        {!isImmersive && (
          <div className="w-full py-8 text-center mt-4 border-t border-white/5 bg-gradient-to-b from-transparent to-black/40 pb-32">
               <p className="text-xs text-aura-mute tracking-wide mb-2">
                 Desenvolvido por <span className="text-white font-bold text-base block mt-1">Paulo Tavares</span>
               </p>
               <div className="inline-block mt-2">
                 <a 
                  href={whatsappLink} 
                  className="flex items-center justify-center gap-2 text-xs px-4 py-2 rounded-full bg-white/5 border border-white/10 text-aura-mute hover:text-aura-mint hover:border-aura-mint hover:bg-aura-mint/10 transition-all duration-300"
                 >
                   <span>Contato:</span>
                   <span className="font-bold text-white tracking-wider">(83) 99938-5147</span>
                 </a>
               </div>
          </div>
        )}
      </main>

      {!isImmersive && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] bg-aura-card/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-6 py-3 z-50 flex justify-between items-center">
          <NavButton 
            icon={<Home size={22} />} 
            active={currentView === ViewState.DASHBOARD} 
            onClick={() => setCurrentView(ViewState.DASHBOARD)} 
            label="Início"
          />
           <NavButton 
            icon={<PlusCircle size={22} />} 
            active={currentView === ViewState.BUILDER} 
            onClick={() => setCurrentView(ViewState.BUILDER)} 
            label="Criar"
          />
          <NavButton 
            icon={<BarChart2 size={22} />} 
            active={currentView === ViewState.STATS} 
            onClick={() => setCurrentView(ViewState.STATS)} 
            label="Progresso"
          />
          <NavButton 
            icon={<User size={22} />} 
            active={currentView === ViewState.PROFILE} 
            onClick={() => setCurrentView(ViewState.PROFILE)} 
            label="Perfil"
          />
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`relative group flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${active ? 'text-aura-mint bg-aura-mint/10 scale-110' : 'text-aura-mute hover:text-white hover:bg-white/5'}`}
  >
    {icon}
    {active && (
      <span className="absolute -bottom-1 w-1 h-1 bg-aura-mint rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
    )}
  </button>
);
