import React, { useEffect, useState } from 'react';
import Navegacion from './Navegacion';
import { auth } from './Firebase/firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const suscriptor = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase ? usuarioFirebase : null);
    });

    return suscriptor; // Limpia el listener al desmontar el componente
  }, []);

  return (
    <Navegacion usuario={usuario} />
  );
}
