import React from 'react';
import useAuthStore from './authStore';

const Home = () => {
  const user = useAuthStore((state) => state.user);

  const nombreUsuario = () => {
    if (!user.fullName) {
      return `Usuario-${user.numFolio}`;
    }else{
      return user.fullName;
    }
  }

  return (
    <div>
      <h1>Bienvenido, {nombreUsuario()}!</h1>
      <p>Esta es la página principal de la aplicación.</p>
    </div>
  );
};

export default Home;