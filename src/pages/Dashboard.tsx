import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { 
  LogOut, 
  Play, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  Layout, 
  User as UserIcon, 
  ExternalLink, 
  FileText,
  Home as HomeIcon,
  Newspaper,
  Award,
  TrendingUp,
  Clock,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

interface Content {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'both';
  videoUrl: string;
  textContent: string;
  isFree: boolean;
  moduleName: string;
  order: number;
}

interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: any;
}

interface Progress {
  id: string;
  contentId: string;
  uid: string;
}

const Dashboard: React.FC = () => {
  const { profile, loading, isAdmin } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Content | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'lessons'>('home');
  const navigate = useNavigate();

  useEffect(() => {
    // Contents
    const qContents = query(collection(db, 'contents'), orderBy('order', 'asc'));
    const unsubContents = onSnapshot(qContents, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Content[];
      setContents(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'contents');
    });

    // News
    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as News[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
    });

    // Progress
    if (auth.currentUser) {
      const qProgress = query(collection(db, 'progress'), where('uid', '==', auth.currentUser.uid));
      const unsubProgress = onSnapshot(qProgress, (snapshot) => {
        setProgress(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Progress[]);
      }, (error) => {
        // No strict error handling here as it might fail for new users
        console.error("Progress error:", error);
      });
      return () => {
        unsubContents();
        unsubNews();
        unsubProgress();
      };
    }

    return () => {
      unsubContents();
      unsubNews();
    };
  }, []);

  const toggleLessonCompletion = async (contentId: string) => {
    if (!auth.currentUser) return;
    const existing = progress.find(p => p.contentId === contentId);
    try {
      if (existing) {
        await deleteDoc(doc(db, 'progress', existing.id));
      } else {
        const id = `${auth.currentUser.uid}_${contentId}`;
        await setDoc(doc(db, 'progress', id), {
          uid: auth.currentUser.uid,
          contentId,
          completedAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'progress');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const isPaid = profile?.isPaid || isAdmin;

  // Group contents by module
  const modules = contents.reduce((acc, content) => {
    if (!acc[content.moduleName]) acc[content.moduleName] = [];
    acc[content.moduleName].push(content);
    return acc;
  }, {} as Record<string, Content[]>);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Improved regex to handle watch?v=, youtu.be, shorts, and embed URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <img 
            src="https://traditional-sapphire-dckn5ppczm.edgeone.app/e7721d0f-a7c7-4cfc-80b5-86eb48b46b21-Photoroom.png" 
            alt="Logo" 
            className="h-10 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FF6B00] rounded-full text-xs font-bold uppercase tracking-wider">
            <Layout size={14} />
            Área do Aluno
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button 
              variant="secondary" 
              className="!py-2 !px-4 text-sm"
              onClick={() => navigate('/admin')}
            >
              Painel Admin
            </Button>
          )}
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200 hidden sm:flex">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#FF6B00]">
              <UserIcon size={20} />
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-900 leading-none">{profile?.displayName}</p>
              <p className="text-slate-500 text-xs mt-1">{isPaid ? 'Membro Premium' : 'Acesso Gratuito'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left SideNav */}
        <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col items-center md:items-start py-8 px-4 gap-8">
          <div className="space-y-4 w-full">
            <button 
              onClick={() => setActiveView('home')}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                activeView === 'home' ? 'bg-[#FF6B00] text-white shadow-xl shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <HomeIcon size={20} />
              <span className="hidden md:block font-bold">Início</span>
            </button>
            <button 
              onClick={() => {
                setActiveView('lessons');
                if (!selectedVideo && contents.length > 0) {
                  const initial = contents.find(c => c.isFree) || contents[0];
                  setSelectedVideo(initial);
                }
              }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                activeView === 'lessons' ? 'bg-[#FF6B00] text-white shadow-xl shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <BookOpen size={20} />
              <span className="hidden md:block font-bold">Aulas</span>
            </button>
            <button 
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-slate-500 hover:bg-slate-50 opacity-50 cursor-not-allowed"
            >
              <Award size={20} />
              <span className="hidden md:block font-bold">Certificados</span>
            </button>
          </div>
          
          <div className="mt-auto w-full pt-8 border-t border-slate-100 space-y-4">
             <div className="hidden md:block px-4 mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Seu Progresso</p>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                  <span>{Math.round((progress.length / (contents.length || 1)) * 100)}%</span>
                  <span>{progress.length}/{contents.length}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.length / (contents.length || 1)) * 100}%` }}
                    className="h-full bg-[#FF6B00]"
                  />
                </div>
             </div>
             <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-slate-400 hover:text-red-500 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span className="hidden md:block font-bold">Sair da Conta</span>
            </button>
          </div>
        </aside>

        {activeView === 'home' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
              {/* Welcome Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 leading-tight">
                    Olá, {profile?.displayName?.split(' ')[0]}!
                  </h1>
                  <p className="text-slate-500 text-lg mt-2 font-medium">Bem-vindo de volta ao seu painel oficial.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plano Atual</p>
                    <p className="text-xl font-bold text-slate-900">{isPaid ? 'Premium' : 'Gratuito'}</p>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{contents.length}</h3>
                  <p className="text-slate-500 font-bold mt-1">Aulas Disponíveis</p>
                </div>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{progress.length}</h3>
                  <p className="text-slate-500 font-bold mt-1">Aulas Concluídas</p>
                </div>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-6 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{Math.round((progress.length / (contents.length || 1)) * 100)}%</h3>
                  <p className="text-slate-500 font-bold mt-1">Conclusão Total</p>
                </div>
              </div>

              {/* News Section */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <Newspaper size={24} className="text-[#FF6B00]" />
                      Últimas Notícias
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {news.length > 0 ? news.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all"
                      >
                        {item.imageUrl && (
                          <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">Aviso</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.createdAt?.seconds * 1000).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{item.content}</p>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 text-center text-slate-400">
                        Nenhuma notícia importante no momento.
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Layout size={24} className="text-[#FF6B00]" />
                    Módulos
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(modules).map((moduleName, index) => {
                      const moduleLessons = modules[moduleName];
                      const completedCount = moduleLessons.filter(l => progress.some(p => p.contentId === l.id)).length;
                      const percent = Math.round((completedCount / moduleLessons.length) * 100);

                      return (
                        <button 
                          key={moduleName}
                          onClick={() => {
                            setActiveView('lessons');
                            setSelectedVideo(moduleLessons[0]);
                          }}
                          className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 text-left hover:border-[#FF6B00] transition-all group"
                        >
                          <div className="flex items-center justify-between mb-3">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Módulo 0{index + 1}</span>
                             {percent === 100 && <CheckCircle2 size={16} className="text-green-500" />}
                          </div>
                          <h4 className="font-bold text-slate-900 mb-3 group-hover:text-[#FF6B00] transition-colors">{moduleName}</h4>
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>{percent}% Concluído</span>
                                <span>{completedCount}/{moduleLessons.length}</span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  className="h-full bg-[#FF6B00]" 
                                />
                             </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Video Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <AnimatePresence mode="wait">
                {selectedVideo && (
                  <motion.div 
                    key={selectedVideo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-5xl mx-auto space-y-8"
                  >
                    {!isPaid && !selectedVideo.isFree ? (
                      <div className="aspect-video bg-slate-900 rounded-[32px] flex flex-col items-center justify-center text-center p-12 space-y-6">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-[#FF6B00]">
                          <Lock size={40} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-white">Conteúdo Exclusivo</h3>
                          <p className="text-slate-400 max-w-md">Para acessar esta aula e todas as outras do método completo, torne-se um membro premium.</p>
                        </div>
                        <Button className="!px-8 !py-4 text-lg">QUERO ACESSO COMPLETO</Button>
                      </div>
                    ) : (
                      <>
                        {(selectedVideo.type === 'video' || selectedVideo.type === 'both') && (
                          <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl">
                            <iframe 
                              src={getEmbedUrl(selectedVideo.videoUrl)} 
                              title={selectedVideo.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}

                        {selectedVideo.type === 'text' && (
                          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-slate-100 min-h-[300px] flex items-center justify-center text-center">
                             <div className="max-w-md space-y-4">
                                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B00] mx-auto">
                                  <FileText size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Material de Apoio</h2>
                                <p className="text-slate-500 text-sm">Esta aula possui guias em texto e materiais importantes logo abaixo.</p>
                             </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <span className="text-[#FF6B00] font-mono text-[10px] uppercase tracking-widest font-bold mb-2 block">
                            {selectedVideo.moduleName}
                          </span>
                          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{selectedVideo.title}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                          {selectedVideo.isFree && (
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 size={12} /> Grátis
                            </span>
                          )}
                          <button 
                            onClick={() => toggleLessonCompletion(selectedVideo.id)}
                            className={`p-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 font-bold text-xs ${
                              progress.some(p => p.contentId === selectedVideo.id)
                                ? 'bg-green-500 text-white shadow-green-100'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 size={18} />
                            <span className="hidden sm:inline">{progress.some(p => p.contentId === selectedVideo.id) ? 'Concluída' : 'Marcar Concluída'}</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="prose prose-slate max-w-none">
                        <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap mb-8">
                          {selectedVideo.description}
                        </p>

                        {(selectedVideo.type === 'text' || selectedVideo.type === 'both') && selectedVideo.textContent && (
                          <div className="mt-8 p-6 md:p-10 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                            {selectedVideo.textContent}
                          </div>
                        )}
                      </div>

                      {(selectedVideo.type === 'video' || selectedVideo.type === 'both') && (
                        <div className="mt-8 pt-8 border-t border-slate-100">
                          <a 
                            href={selectedVideo.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-[#FF6B00] font-bold hover:underline"
                          >
                            <ExternalLink size={14} />
                            Ver no YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-96 bg-white border-l border-slate-200 overflow-y-auto order-first lg:order-last">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Layout size={18} className="text-[#FF6B00]" />
                  Conteúdo do Curso
                </h2>
              </div>

              <div className="p-2">
                {(Object.entries(modules) as [string, Content[]][]).map(([moduleName, lessons]) => (
                  <div key={moduleName} className="mb-4">
                    <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between items-center">
                      <span>{moduleName}</span>
                      <span>{lessons.filter(l => progress.some(p => p.contentId === l.id)).length}/{lessons.length}</span>
                    </div>
                    <div className="space-y-1">
                      {lessons.map((lesson) => {
                        const isLocked = !isPaid && !lesson.isFree;
                        const isSelected = selectedVideo?.id === lesson.id;
                        const isCompleted = progress.some(p => p.contentId === lesson.id);
                        
                        return (
                          <button 
                            key={lesson.id}
                            onClick={() => setSelectedVideo(lesson)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-left group ${
                              isSelected ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                              isCompleted ? 'bg-green-50 text-green-500' : isSelected ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 size={16} />
                              ) : isLocked ? (
                                <Lock size={16} className={isSelected ? 'text-[#FF6B00]' : 'text-slate-400'} />
                              ) : (
                                lesson.type === 'text' ? (
                                  <FileText size={16} className={isSelected ? 'text-[#FF6B00]' : 'text-slate-500'} />
                                ) : (
                                  <Play size={16} className={isSelected ? 'text-[#FF6B00]' : 'text-slate-500'} />
                                )
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{lesson.type}</span>
                                {isCompleted && <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Feito</span>}
                              </div>
                            </div>
                            <ChevronRight size={16} className={`transition-transform ${isSelected ? 'translate-x-1 text-[#FF6B00]' : 'text-slate-200'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
