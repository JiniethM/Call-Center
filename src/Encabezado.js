import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Componente funcional Encabezado
export default function Encabezado({ navigation }) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.texto}>¡Bienvenido!</Text>
      <Image
        source={require('../images/1.png')}
        style={estilos.imagen}
      />
      <Text style={estilos.subtexto}>
        Nos alegra tenerte aquí. Explora, organiza y disfruta de esta experiencia.
      </Text>
      <TouchableOpacity
        style={estilos.boton}
        onPress={() => navigation.navigate('FormularioLlamada')}
      >
        <Text style={estilos.textoBoton}>Comenzar</Text>
      </TouchableOpacity>
      <View style={estilos.decoracion}>
        <Text style={estilos.motivacion}>
          “El éxito es la suma de pequeños esfuerzos repetidos día tras día.”
        </Text>
      </View>
    </View>
  );
}

// Definición de estilos para el Encabezado
const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7e6',
  },
  texto: {
    fontSize: 28,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imagen: {
    width: 100,
    height: 100,
    marginVertical: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'orange',
  },
  subtexto: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  boton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  decoracion: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
    width: '80%',
  },
  motivacion: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
  },
});
