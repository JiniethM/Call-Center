import React, { useState } from 'react';
import { StyleSheet, View, Alert, Text, Image, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

export default function FormularioLlamada() {
  const [datos, setDatos] = useState({
    nombreCliente: '',
    telefonoCliente: '',
    emailCliente: '',
    estadoLlamada: '',
    comentarios: '',
    duracionLlamada: '',
    nombreAgente: '',
    userEmail: '',
    createdAt: null,
    imagenUri: '',
  });

  const handleChange = (nombre, valor) => {
    setDatos({ ...datos, [nombre]: valor });
  };

  const validarCampos = () => {
    if (
      datos.nombreCliente.trim() === '' ||
      datos.telefonoCliente.trim() === '' ||
      datos.emailCliente.trim() === '' ||
      datos.estadoLlamada.trim() === '' ||
      datos.duracionLlamada.toString().trim() === '' ||
      datos.nombreAgente.trim() === ''
    ) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return false;
    }

    if (datos.nombreCliente.match(/\d/)) {
      Alert.alert('Error', 'El Nombre del Cliente no debe contener números.');
      return false;
    }

    if (!/^\d{4}-\d{4}$/.test(datos.telefonoCliente)) {
      Alert.alert('Error', 'El Teléfono debe tener el formato XXXX-XXXX.');
      return false;
    }

    if (!datos.emailCliente.endsWith('@gmail.com')) {
      Alert.alert('Error', 'El Correo debe terminar con @gmail.com.');
      return false;
    }

    const duracion = parseInt(datos.duracionLlamada);
    if (isNaN(duracion) || duracion > 60 || duracion <= 0) {
      Alert.alert('Error', 'La Duración de la Llamada debe ser un número entre 1 y 60.');
      return false;
    }

    if (datos.nombreAgente.match(/\d/)) {
      Alert.alert('Error', 'El Nombre del Agente no debe contener números.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validarCampos()) {
      try {
        await addDoc(collection(db, 'llamadas'), {
          ...datos,
          duracionLlamada: parseInt(datos.duracionLlamada),
          createdAt: serverTimestamp(),
        });
        Alert.alert('Éxito', 'Llamada agregada correctamente.');
        setDatos({
          nombreCliente: '',
          telefonoCliente: '',
          emailCliente: '',
          estadoLlamada: '',
          comentarios: '',
          duracionLlamada: '',
          nombreAgente: '',
          userEmail: '',
          createdAt: null,
          imagenUri: '',
        });
      } catch (error) {
        console.error('Error al agregar la llamada:', error);
        Alert.alert('Error', 'No se pudo agregar la llamada.');
      }
    }
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar una imagen.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setDatos({ ...datos, imagenUri: resultado.assets[0].uri });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Agregar Nueva Llamada</Text>
        <TextInput
          label="Nombre Cliente"
          value={datos.nombreCliente}
          onChangeText={(text) => handleChange('nombreCliente', text)}
          mode="outlined"
          style={[styles.input, { borderColor: 'orange' }]}
          outlineColor="orange"
          activeOutlineColor="orange"
        />
        <TextInput
          label="Teléfono Cliente (XXXX-XXXX)"
          value={datos.telefonoCliente}
          onChangeText={(text) => handleChange('telefonoCliente', text)}
          mode="outlined"
          style={[styles.input, { borderColor: 'orange' }]}
          outlineColor="orange"
          activeOutlineColor="orange"
          keyboardType="phone-pad"
        />
        <TextInput
          label="Email Cliente"
          value={datos.emailCliente}
          onChangeText={(text) => handleChange('emailCliente', text)}
          mode="outlined"
          style={[styles.input, { borderColor: 'orange' }]}
          outlineColor="orange"
          activeOutlineColor="orange"
          keyboardType="email-address"
        />
        <TextInput
          label="Estado de la Llamada"
          value={datos.estadoLlamada}
          onChangeText={(text) => handleChange('estadoLlamada', text)}
          mode="outlined"
          style={[styles.input, { borderColor: 'orange' }]}
          outlineColor="orange"
          activeOutlineColor="orange"
        />
        <TextInput
          label="Comentarios"
          value={datos.comentarios}
          onChangeText={(text) => handleChange('comentarios', text)}
          mode="outlined"
          style={[styles.input, styles.comentarios, { borderColor: 'orange' }]}
          outlineColor="orange"
          activeOutlineColor="orange"
          multiline
          numberOfLines={4}
        />
        <TextInput
          label="Duración de la Llamada (min)"
          value={datos.duracionLlamada}
          onChangeText={(text) => handleChange('duracionLlamada', text)}
          mode="outlined"
          style={[styles.input, { borderColor: 'orange' }]}
          outlineColor="orange"
          activeOutlineColor="orange"
          keyboardType="numeric"
        />
        <TextInput
          label="Nombre del Agente"
          value={datos.nombreAgente}
          onChangeText={(text) => handleChange('nombreAgente', text)}
          mode="outlined"
          style={[styles.input, { borderColor: 'orange' }]}
          outlineColor="orange"
          activeOutlineColor="orange"
        />
        <Button
          mode="contained"
          onPress={seleccionarImagen}
          style={[styles.button, { backgroundColor: 'orange' }]}
          labelStyle={{ color: 'white' }}
        >
          Seleccionar Imagen
        </Button>
        {datos.imagenUri ? (
          <Image source={{ uri: datos.imagenUri }} style={styles.imagen} />
        ) : (
          <Text style={styles.noImagen}>No se ha seleccionado ninguna imagen</Text>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.button, { backgroundColor: 'orange' }]}
          labelStyle={{ color: 'white' }}
        >
          Agregar Llamada
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff7e6',
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'orange',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  comentarios: {
    height: 100,
  },
  button: {
    marginTop: 10,
    borderRadius: 5,
  },
  imagen: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'orange',
  },
  noImagen: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color: '#ff944d',
  },
});
