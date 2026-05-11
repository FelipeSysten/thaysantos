import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { 
  Plus, 
  Video, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  ExternalLink, 
  Eye, 
  EyeOff,
  MoveUp,
  MoveDown,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Newspaper
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isPaid: boolean;
  role: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: any;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [tab, setTab] = useState<'content' | 'users' | 'news'>('content');
  const navigate = useNavigate();

  // News Form State
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [type, setType] = useState<'video' | 'text' | 'both'>('video');
  const [isFree, setIsFree] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    const qContent = query(collection(db, 'contents'), orderBy('order', 'asc'));
    const unsubContent = onSnapshot(qContent, (snapshot) => {
      setContents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Content[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'contents');
    });

    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as News[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
    });

    return () => {
      unsubContent();
      unsubUsers();
      unsubNews();
    };
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      type,
      videoUrl: type === 'text' ? '' : videoUrl,
      textContent: type === 'video' ? '' : textContent,
      isFree,
      moduleName,
      order: Number(order),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'contents', editingId), {
          ...data,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'contents'), data);
      }
      setIsAdding(false);
      resetForm();
    } catch (err) {
      handleFirestoreError(err, editingId ? OperationType.UPDATE : OperationType.CREATE, 'contents');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setTextContent('');
    setType('video');
    setIsFree(false);
    setModuleName('');
    setOrder(contents.length + 1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      try {
        await deleteDoc(doc(db, 'contents', id));
      } catch (err: any) {
        const message = err.message || 'Erro ao deletar';
        alert(`Erro ao excluir: ${message}`);
        handleFirestoreError(err, OperationType.DELETE, `contents/${id}`);
      }
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'news'), {
        title: newsTitle,
        content: newsContent,
        imageUrl: newsImage,
        createdAt: serverTimestamp()
      });
      setNewsTitle('');
      setNewsContent('');
      setNewsImage('');
      setIsAddingNews(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'news');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('Deletar noticia?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `news/${id}`);
      }
    }
  };

  const togglePaid = async (user: UserProfile) => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isPaid: !user.isPaid
      });
    } catch (err: any) {
      const message = err.message || 'Erro ao atualizar';
      alert(`Erro ao atualizar acesso: ${message}`);
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleEdit = (c: Content) => {
    setEditingId(c.id);
    setTitle(c.title);
    setDescription(c.description);
    setVideoUrl(c.videoUrl || '');
    setTextContent(c.textContent || '');
    setType(c.type || 'video');
    setIsFree(c.isFree);
    setModuleName(c.moduleName);
    setOrder(c.order);
    setIsAdding(true);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-4">
            <img 
              src="https://traditional-sapphire-dckn5ppczm.edgeone.app/e7721d0f-a7c7-4cfc-80b5-86eb48b46b21-Photoroom.png" 
              alt="Logo" 
              className="h-10"
            />
            <h1 className="text-xl font-bold text-slate-900 border-l border-slate-200 pl-4">Admin Dashboard</h1>
          </div>
        </div>

        <nav className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setTab('content')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'content' ? 'bg-white text-[#FF6B00] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Conteúdo
          </button>
          <button 
            onClick={() => setTab('users')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'users' ? 'bg-white text-[#FF6B00] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Usuários
          </button>
          <button 
            onClick={() => setTab('news')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'news' ? 'bg-white text-[#FF6B00] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Notícias
          </button>
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {tab === 'content' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Gerenciar Conteúdo</h2>
                <p className="text-slate-500 mt-1">Adicione módulos e aulas para seus alunos.</p>
              </div>
              <Button onClick={() => { setIsAdding(true); resetForm(); }} className="gap-2">
                <Plus size={20} /> Nova Aula
              </Button>
            </div>

            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100"
              >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {editingId ? 'Editar Aula' : 'Nova Aula'}
                    </h3>
                    <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-900 text-sm font-bold">Cancelar</button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Título da Aula</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                      placeholder="Ex: Primeiros Passos na Shopee"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Módulo</label>
                    <input 
                      type="text" 
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                      placeholder="Ex: Módulo 1: Introdução"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo de Conteúdo</label>
                    <div className="flex gap-4">
                      {['video', 'text', 'both'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t as any)}
                          className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                            type === t ? 'bg-[#FF6B00] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {t === 'both' ? 'Vídeo e Texto' : t === 'video' ? 'Vídeo' : 'Texto'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(type === 'video' || type === 'both') && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">URL do Vídeo (Youtube)</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                          placeholder="https://www.youtube.com/watch?v=..."
                          required={type !== 'text'}
                        />
                        {videoUrl && (
                          <a 
                            href={videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 bg-slate-100 text-slate-400 hover:text-[#FF6B00] rounded-2xl transition-all"
                            title="Testar Link"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Cole o link do vídeo do YouTube. Funciona com links curtos, shorts ou links normais.</p>
                    </div>
                  )}

                  {(type === 'text' || type === 'both') && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Conteúdo em Texto / Blocos</label>
                      <textarea 
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none min-h-[200px]"
                        placeholder="Escreva o conteúdo da aula, avisos, links importantes ou materiais..."
                        required={type === 'text'}
                      ></textarea>
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none min-h-[120px]"
                      placeholder="O que os alunos vão aprender nesta aula?"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isFree"
                        checked={isFree}
                        onChange={(e) => setIsFree(e.target.checked)}
                        className="w-5 h-5 rounded-md border-slate-200 text-[#FF6B00] focus:ring-[#FF6B00] transition-colors"
                      />
                      <label htmlFor="isFree" className="text-sm font-bold text-slate-700">Aula Gratuita?</label>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm font-bold text-slate-700">Ordem:</label>
                      <input 
                        type="number" 
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                        className="w-20 px-3 py-1 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <Button type="submit" className="!px-12 py-4">
                      {editingId ? 'Salvar Alterações' : 'Criar Aula'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {contents.map((c) => (
                <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-[#FF6B00] group-hover:bg-orange-50 transition-colors">
                      <Video size={24} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-widest">#{c.order}</span>
                        <span className="text-[#FF6B00] text-[10px] font-bold uppercase tracking-widest">{c.moduleName}</span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 truncate">{c.title}</h3>
                      <p className="text-slate-400 text-sm truncate max-w-md">{c.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2 pr-6 border-r border-slate-100">
                      {c.isFree ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider">
                          <Eye size={12} /> Aberta
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">
                          <EyeOff size={12} /> Bloqueada
                        </span>
                      )}
                    </div>
                    
                    <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-[#FF6B00] hover:bg-orange-50 rounded-xl transition-all">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tab === 'users' ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Alunos e Acessos</h2>
              <p className="text-slate-500 mt-1">Gerencie quem tem acesso premium ao conteúdo.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Aluno</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">E-mail</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                            <UserIcon size={18} />
                          </div>
                          <span className="font-bold text-slate-900">{u.displayName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-500">{u.email}</td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          {u.isPaid ? (
                            <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                              <CheckCircle2 size={14} /> Premium
                            </span>
                          ) : (
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                              <XCircle size={14} /> Gratuito
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => togglePaid(u)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                            u.isPaid ? 'border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-white' : 'bg-[#FF6B00] text-white shadow-sm hover:shadow-md'
                          }`}
                        >
                          {u.isPaid ? 'Remover Acesso' : 'Liberar Acesso'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : tab === 'news' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Gerenciar Notícias</h2>
                <p className="text-slate-500 mt-1">Publique avisos e novidades no painel do aluno.</p>
              </div>
              <Button onClick={() => setIsAddingNews(true)} className="gap-2">
                <Plus size={20} /> Nova Notícia
              </Button>
            </div>

            {isAddingNews && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100"
              >
                <form onSubmit={handleNewsSubmit} className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Nova Notícia</h3>
                    <button type="button" onClick={() => setIsAddingNews(false)} className="text-slate-400 hover:text-slate-900 text-sm font-bold">Cancelar</button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Título da Notícia</label>
                    <input 
                      type="text" 
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                      placeholder="Ex: Novo Módulo de Vendas Diretas Liberado!"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Conteúdo do Aviso</label>
                    <textarea 
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none min-h-[150px]"
                      placeholder="Escreva os detalhes da notícia..."
                      required
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">URL da Imagem (Opcional)</label>
                    <input 
                      type="url" 
                      value={newsImage}
                      onChange={(e) => setNewsImage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="!px-12 py-4">Publicar Notícia</Button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{item.content}</p>
                    </div>
                    <button onClick={() => handleDeleteNews(item.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50">
                    <span>{new Date(item.createdAt?.seconds * 1000).toLocaleDateString('pt-BR')}</span>
                    {item.imageUrl && <span className="text-[#FF6B00]">Com Imagem</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default AdminDashboard;
