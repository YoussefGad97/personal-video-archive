
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';

const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user.isAuthenticated) {
      navigate('/gallery');
    }
  }, [user, navigate]);
  
  return <AuthForm />;
};

export default Login;
