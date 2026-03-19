import CampusConnectHero from '../components/ui/neurons-hero';
import { useAuth } from '../context/useAuth';

const Landing = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-black transition-colors duration-300">
      <CampusConnectHero isLoggedIn={!!user} />
    </div>
  );
};

export default Landing;