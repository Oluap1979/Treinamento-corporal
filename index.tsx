import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { Layout } from './Layout';
import { ViewState, Workout, Exercise } from './types';
import { Dumbbell, Sparkles, Play, Calendar, Trophy, Activity, Loader2, Save, Trash2, BarChart2, User } from 'lucide-react';

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-white bg-red-950/80 h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Ops! Algo deu errado.</h1>
          <div className="text-left bg-black/50 p-4 rounded-lg max-w-full overflow-auto border border-red-900/50">
            <p className="text-red-200 font-mono text-sm whitespace-pre-wrap">
              {this.state.error?.message || "Erro desconhecido"}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-full text-white font-medium transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Custom CSS Injection for "Aura" Theme ---
const AuraStyles = () => (
  <style>{`
    .bg-aura-dark { background-color: #09090b; }
    .bg-aura-card { background-color: #18181b; }
    .bg-aura-light { background-color: #27272a; }
    .bg-aura-mint { background-color: #34d399; }
    .text-aura-dark { color: #09090b; }
    .text-aura-mint { color: #34d399; }
    .text-aura-mute { color: #a1a1aa; }
    .border-aura-mint { border-color: #34d399; }
    .hover\\:bg-aura-mint\\/10:hover { background-color: rgba(52, 211, 153, 0.1); }
    .bg-aura-mint\\/10 { background-color: rgba(52, 211, 153, 0.1); }
    .bg-aura-mint\\/5 { background-color: rgba(52, 211, 153, 0.05); }
    .hover\\:text-aura-mint:hover { color: #34d399; }
    .hover\\:border-aura-mint:hover { border-color: #34d399; }
    
    /* Smooth scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #09090b; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #34d399; }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
  `}</style>
);

// --- Components ---

const Dashboard = ({ workouts, onStartWorkout }: { workouts: Workout[], onStartWorkout: (w: Workout) => void }) => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Olá, Atleta</h1>
          <p className="text-aura-mute text-sm">Pronto para o treino de hoje?</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-aura-mint to-blue-500 flex items-center justify-center">
          <span className="font-bold text-black text-sm">PT</span>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-aura-card p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-aura-mint mb-2">
            <Activity size={16} />
            <span className="text-xs font-medium">Frequência</span>
          </div>
          <p className="text-2xl font-bold">4 <span className="text-sm text-aura-mute font-normal">dias</span></p>
        </div>
        <div className="bg-aura-card p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Trophy size={16} />
            <span className="text-xs font-medium">Concluídos</span>
          </div>
          <p className="text-2xl font-bold">12 <span className="text-sm text-aura-mute font-normal">treinos</span></p>
        </div>
      </div>

      {/* Active Workouts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Dumbbell size={18} className="text-aura-mint" />
          Seus Treinos
        </h2>
        {workouts.length === 0 ? (
          <div className="text-center py-10 bg-aura-card/50 rounded-2xl border border-white/5 border-dashed">
            <p className="text-aura-mute mb-2">Nenhum treino criado ainda.</p>
            <p className="text-sm text-white/50">Vá para a aba "Criar" para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map(workout => (
              <div key={workout.id} className="bg-aura-card p-4 rounded-2xl border border-white/5 hover:border-aura-mint/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white">{workout.title}</h3>
                    <p className="text-xs text-aura-mute">{workout.exercises.length} exercícios • {workout.durationMinutes || 45} min</p>
                  </div>
                  <button 
                    onClick={() => onStartWorkout(workout)}
                    className="w-8 h-8 rounded-full bg-aura-mint flex items-center justify-center text-aura-dark hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play size={14} fill="currentColor" />
                  </button>
                </div>
                <div className="flex gap-2 overflow-hidden">
                  {workout.exercises.slice(0, 3).map((ex, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded text-aura-mute whitespace-nowrap">
                      {ex.name}
                    </span>
                  ))}
                  {workout.exercises.length > 3 && (
                    <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-aura-mute">+ {workout.exercises.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WorkoutBuilder = ({ onSave }: { onSave: (workout: Workout) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setGeneratedWorkout(null);

    try {
      // Safely access API Key to prevent crashes if environment is not configured correctly
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
      
      if (!apiKey) {
        throw new Error("API Key não encontrada. O aplicativo precisa ser configurado com uma chave de API do Google Gemini.");
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Crie um treino detalhado para o seguinte objetivo: "${prompt}". Retorne em português do Brasil.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título motivador do treino" },
              description: { type: Type.STRING, description: "Breve descrição do objetivo" },
              durationMinutes: { type: Type.NUMBER, description: "Duração estimada em minutos" },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    sets: { type: Type.NUMBER },
                    reps: { type: Type.STRING },
                    note: { type: Type.STRING, description: "Dica técnica breve" }
                  },
                  required: ["name", "sets", "reps"]
                }
              }
            },
            required: ["title", "exercises"]
          }
        }
      });

      const data = JSON.parse(response.text);
      
      const newWorkout: Workout = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        exercises: data.exercises,
        durationMinutes: data.durationMinutes,
        createdAt: new Date()
      };

      setGeneratedWorkout(newWorkout);
    } catch (error) {
      console.error("Erro ao gerar treino:", error);
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-aura-mint" />
          IA Personal
        </h1>
        <p className="text-aura-mute text-sm">Descreva seu objetivo e a IA criará seu treino.</p>
      </header>

      {!generatedWorkout ? (
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Quero um treino de pernas com foco em hipertrofia, tenho apenas halteres e 40 minutos."
            className="w-full bg-aura-card border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-aura-mint h-40 resize-none placeholder:text-white/20"
          />
          
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-aura-mint to-emerald-600 text-aura-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Criando Treino...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Gerar Treino
              </>
            )}
          </button>

          {/* Suggestions */}
          <div className="mt-4">
            <p className="text-xs text-aura-mute uppercase tracking-wider mb-3">Sugestões</p>
            <div className="flex flex-wrap gap-2">
              {["HIIT 20 min em casa", "Peito e Tríceps Avançado", "Yoga para iniciantes", "Glúteos sem equipamento"].map(sug => (
                <button
                  key={sug}
                  onClick={() => setPrompt(sug)}
                  className="text-xs bg-white/5 px-3 py-2 rounded-full hover:bg-white/10 transition-colors text-white/80 cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-fade-in">
          <div className="bg-aura-card rounded-2xl p-5 border border-aura-mint/20 mb-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">{generatedWorkout.title}</h2>
              <span className="text-xs bg-aura-mint/10 text-aura-mint px-2 py-1 rounded">{generatedWorkout.durationMinutes} min</span>
            </div>
            <p className="text-sm text-aura-mute mb-6">{generatedWorkout.description}</p>

            <div className="space-y-4">
              {generatedWorkout.exercises.map((ex, idx) => (
                <div key={idx} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0">
                  <span className="text-aura-mint font-bold text-lg w-6">{idx + 1}</span>
                  <div>
                    <p className="font-bold text-white">{ex.name}</p>
                    <p className="text-sm text-aura-mute">{ex.sets} séries x {ex.reps}</p>
                    {ex.note && <p className="text-xs text-white/50 mt-1 italic">{ex.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setGeneratedWorkout(null)}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 size={18} /> Descartar
            </button>
            <button 
              onClick={() => onSave(generatedWorkout)}
              className="flex-[2] py-3 rounded-xl bg-aura-mint text-aura-dark font-bold hover:bg-emerald-400 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={18} /> Salvar Treino
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Stats = () => (
  <div className="p-6 flex flex-col h-full items-center justify-center text-center animate-fade-in">
    <div className="w-24 h-24 bg-aura-card rounded-full flex items-center justify-center mb-6 animate-pulse">
      <BarChart2 size={40} className="text-aura-mute" />
    </div>
    <h2 className="text-xl font-bold text-white mb-2">Estatísticas em Breve</h2>
    <p className="text-aura-mute max-w-xs">Estamos construindo gráficos detalhados do seu progresso. Continue treinando!</p>
  </div>
);

const Profile = () => (
  <div className="p-6 animate-fade-in">
    <header className="mb-8 text-center">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-aura-card to-white/5 rounded-full flex items-center justify-center border-2 border-aura-mint mb-4">
        <User size={40} className="text-white" />
      </div>
      <h2 className="text-xl font-bold text-white">Usuário Visitante</h2>
      <p className="text-aura-mint text-sm">Membro desde 2024</p>
    </header>

    <div className="bg-aura-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <span className="text-white">Modo Escuro</span>
        <div className="w-10 h-6 bg-aura-mint rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
      </div>
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <span className="text-white">Notificações</span>
        <div className="w-10 h-6 bg-white/10 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full"></div></div>
      </div>
      <div className="p-4 flex justify-between items-center hover:bg-white/5 cursor-pointer">
        <span className="text-red-400">Sair</span>
      </div>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      title: 'Treino Full Body',
      description: 'Corpo inteiro para iniciantes',
      durationMinutes: 45,
      createdAt: new Date(),
      exercises: [
        { name: 'Agachamento Livre', sets: 3, reps: '12', note: 'Mantenha coluna reta' },
        { name: 'Flexão de Braço', sets: 3, reps: '10-15' },
        { name: 'Remada Curvada', sets: 3, reps: '12' },
        { name: 'Prancha Abdominal', sets: 3, reps: '30s' }
      ]
    }
  ]);

  const handleSaveWorkout = (workout: Workout) => {
    setWorkouts([workout, ...workouts]);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleStartWorkout = (workout: Workout) => {
    alert(`Iniciando treino: ${workout.title}`);
  };

  return (
    <ErrorBoundary>
      <AuraStyles />
      <Layout currentView={currentView} setCurrentView={setCurrentView}>
        {currentView === ViewState.DASHBOARD && (
          <Dashboard workouts={workouts} onStartWorkout={handleStartWorkout} />
        )}
        {currentView === ViewState.BUILDER && (
          <WorkoutBuilder onSave={handleSaveWorkout} />
        )}
        {currentView === ViewState.STATS && <Stats />}
        {currentView === ViewState.PROFILE && <Profile />}
      </Layout>
    </ErrorBoundary>
  );
};

// --- Entry Point ---
// Ensure DOM is ready
const mount = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = createRoot(rootElement);
      root.render(<App />);
    } catch (e) {
      console.error("Failed to create root:", e);
      rootElement.innerHTML = '<div style="color:red; padding: 20px;">Erro crítico ao inicializar aplicação.</div>';
    }
  } else {
    console.error("Root element not found");
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}