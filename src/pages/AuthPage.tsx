import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Button } from '../components/Button';
import { ArrowLeft, Mail, Lock, User as UserIcon } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro ao entrar. Tente novamente.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError('O login foi cancelado. Clique novamente para tentar.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('O navegador bloqueou o pop-up de login. Por favor, permita pop-ups para este site.');
      } else {
        setError('Ocorreu um erro ao entrar com Google. Tente novamente.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-slate-50">
      <motion.button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[#FF6B00] transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Voltar</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <img 
            src="https://traditional-sapphire-dckn5ppczm.edgeone.app/e7721d0f-a7c7-4cfc-80b5-86eb48b46b21-Photoroom.png" 
            alt="Logo" 
            className="h-16 mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Bem-vindo de volta' : 'Comece sua jornada'}
          </h2>
          <p className="text-slate-500 mt-2">
            {isLogin ? 'Faça login para acessar seu conteúdo' : 'Crie sua conta para começar a recomeçar'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-[#FF6B00] focus:ring-0 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <Button type="submit" className="w-full py-4 text-lg" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Carregando...
              </span>
            ) : (
              isLogin ? 'Entrar' : 'Cadastrar'
            )}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-400 font-medium">Ou continue com</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-200 transition-colors font-semibold text-slate-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-slate-600 font-medium">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          {' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FF6B00] hover:underline font-bold"
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
