// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

export default function PantallaLogin({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);

  const animacionLogo = useState(new Animated.Value(0))[0];
  const animacionInputs = useState(new Animated.Value(0))[0];
  const animacionBoton = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animacionLogo, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(animacionInputs, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(animacionBoton, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const manejarInicioSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Campos vacíos', 'Por favor, completa todos los campos.');
      return;
    }

    if (!validarCorreo(correo)) {
      Alert.alert('Email inválido', "Por favor, ingresa un email válido que contenga '@'.");
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      Alert.alert('Inicio de sesión exitoso', '¡Has iniciado sesión correctamente!');
    } catch (error) {
      Alert.alert('Error en Inicio de Sesión', 'Usuario o contraseña incorrectos.');
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Animated.Image
        source={require('../images/1-removebg-preview.png')}
        style={[
          estilos.logo,
          {
            opacity: animacionLogo,
            transform: [
              { scale: animacionLogo.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
              { rotate: animacionLogo.interpolate({ inputRange: [0, 1], outputRange: ['45deg', '0deg'] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={{
          opacity: animacionInputs,
          transform: [{ translateX: animacionInputs.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] }) }],
          width: '100%',
          marginBottom: 20,
        }}
      >
        <TextInput
          style={estilos.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#666"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={estilos.inputGroup}>
          <TextInput
            style={estilos.inputConIcono}
            placeholder="Contraseña"
            placeholderTextColor="#666"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry={!verContrasena}
          />
          <TouchableOpacity
            onPress={() => setVerContrasena(!verContrasena)}
            style={estilos.iconoDentroInput}
          >
            <Icon
              name={verContrasena ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          opacity: animacionBoton,
          transform: [{ translateX: animacionBoton.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }],
          width: '100%',
        }}
      >
        <TouchableOpacity style={estilos.boton} onPress={manejarInicioSesion}>
          <Text style={estilos.textoBoton}>Iniciar sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'orange',
  },
  inputConIcono: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#333',
    borderWidth: 1,
    borderColor: 'orange',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  iconoDentroInput: {
    position: 'absolute',
    right: 10,
    top: 13,
  },
  boton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
