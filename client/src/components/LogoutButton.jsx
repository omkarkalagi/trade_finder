import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LogoutButton = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
      Logout
    </button>
  );
};

export default LogoutButton; 