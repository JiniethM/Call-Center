// Home.js

import React from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Encabezado from '../src/Encabezado';
import ListaLlamadas from '../src/ListaLlamadas';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebaseConfig'; 

export default function PantallaInicio({ navigation, usuario }) {
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      Alert.alert('Éxito', 'Has cerrado sesión correctamente.');
      // No necesitas navegar manualmente a 'Login', ya que el listener en App.js lo hará automáticamente
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        {/* Botón para cerrar sesión */}
        <TouchableOpacity style={estilos.botonFlecha} onPress={cerrarSesion}>
          <Ionicons name="arrow-back" size={30} color="orange" />
        </TouchableOpacity>
        
        {/* Componente Encabezado */}
        <Encabezado />
        
        {/* Espacio a la derecha del encabezado */}
        <View style={estilos.espacioFlecha} />
      </View>

      {/* Contenido de la lista de llamadas */}
      <View style={estilos.contenido}>
        <ListaLlamadas usuario={usuario} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  botonFlecha: {
    width: 30,
    alignItems: 'flex-start',
  },
  espacioFlecha: {
    width: 30,
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
});
