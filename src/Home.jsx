import React from 'react';
import useAuthStore from './authStore';

const Home = () => {
  const user = useAuthStore((state) => state.user);

  const nombreUsuario = () => {
    if (user.noReloj && user.folio.Usuario !== null) {
      return user.folio.Usuario.nombre + ' ' + user.folio.Usuario.apellidoPat;
    }else if(!user.Usuario){
      return `Usuario-${user.numFolio}`;
    }else{
      return user.Usuario.nombre + ' ' + user.Usuario.apellidoPat;
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