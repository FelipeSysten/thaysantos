import { Button } from './Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const BottomNav = () => {
  const { user } = useAuth();
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-full p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(255,107,0,0.2)] border border-white/50">
        <div className="pl-4">
          <img 
            src="https://traditional-sapphire-dckn5ppczm.edgeone.app/e7721d0f-a7c7-4cfc-80b5-86eb48b46b21-Photoroom.png" 
            alt="Logo" 
            className="h-10 w-auto"
          />
        </div>
        <Link to={user ? "/dashboard" : "/auth"}>
          <Button className="!px-6 !py-3 text-sm font-bold">
            {user ? "PAINEL" : "RECOMEÇAR"}
          </Button>
        </Link>
      </div>
    </div>
  );
};
