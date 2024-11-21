import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, Alert, Image, RefreshControl, ScrollView } from 'react-native';
import { Card, IconButton, TextInput, Button } from 'react-native-paper';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../Firebase/firebaseConfig';

export default function ListaLlamadas() {
  const [llamadas, setLlamadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editDatos, setEditDatos] = useState({
    nombreCliente: '',
    telefonoCliente: '',
    emailCliente: '',
    estadoLlamada: '',
    comentarios: '',
    duracionLlamada: '',
    nombreAgente: '',
    imagenUri: '',
  });

  useEffect(() => {
    obtenerLlamadas();
  }, []);

  const obtenerLlamadas = async () => {
    try {
      setCargando(true);
      const q = query(collection(db, 'llamadas'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const llamadasData = [];
      querySnapshot.forEach((docu) => {
        const data = docu.data();
        const fecha = data.createdAt?.toDate().toLocaleString() || 'Sin fecha';
        llamadasData.push({ id: docu.id, ...data, fecha });
      });
      setLlamadas(llamadasData);
    } catch (error) {
      console.error('Error al obtener las llamadas:', error);
      Alert.alert('Error', 'No se pudieron obtener las llamadas.');
    } finally {
      setCargando(false);
      setIsRefreshing(false);
    }
  };

  const eliminarLlamada = async (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar esta llamada?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'llamadas', id));
              Alert.alert('Éxito', 'Llamada eliminada correctamente.');
              obtenerLlamadas();
            } catch (error) {
              console.error('Error al eliminar la llamada:', error);
              Alert.alert('Error', 'No se pudo eliminar la llamada.');
            }
          },
        },
      ]
    );
  };

  const editarLlamada = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setEditDatos({
      nombreCliente: item.nombreCliente,
      telefonoCliente: item.telefonoCliente,
      emailCliente: item.emailCliente,
      estadoLlamada: item.estadoLlamada,
      comentarios: item.comentarios,
      duracionLlamada: item.duracionLlamada.toString(),
      nombreAgente: item.nombreAgente,
      imagenUri: item.imagenUri || '',
    });
  };

  const handleEditChange = (field, value) => {
    setEditDatos((prevDatos) => ({
      ...prevDatos,
      [field]: value,
    }));
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
      const uri = resultado.assets[0]?.uri;
      setEditDatos((prevDatos) => ({
        ...prevDatos,
        imagenUri: uri,
      }));
      Alert.alert('Imagen seleccionada', 'La imagen se ha actualizado correctamente.');
    }
  };

  const actualizarLlamada = async () => {
    try {
      const llamadaRef = doc(db, 'llamadas', editId);
      await updateDoc(llamadaRef, {
        ...editDatos,
        duracionLlamada: parseInt(editDatos.duracionLlamada),
      });
      Alert.alert('Éxito', 'Llamada actualizada correctamente.');
      cancelarEdicion();
      obtenerLlamadas();
    } catch (error) {
      console.error('Error al actualizar la llamada:', error);
      Alert.alert('Error', 'No se pudo actualizar la llamada.');
    }
  };

  const cancelarEdicion = () => {
    setIsEditing(false);
    setEditId(null);
    setEditDatos({
      nombreCliente: '',
      telefonoCliente: '',
      emailCliente: '',
      estadoLlamada: '',
      comentarios: '',
      duracionLlamada: '',
      nombreAgente: '',
      imagenUri: '',
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    obtenerLlamadas();
  };

  const renderLlamada = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.nombreCliente}
        subtitle={`Teléfono: ${item.telefonoCliente} | Duración: ${item.duracionLlamada} minutos`}
        right={(props) => (
          <>
          
            <IconButton {...props} icon="pencil" onPress={() => editarLlamada(item)} />
            <IconButton {...props} icon="delete" color="red" onPress={() => eliminarLlamada(item.id)} />
          </>
        )}
      />
      <Card.Content>
        <Text>Estado: {item.estadoLlamada}</Text>
        <Text>Email: {item.emailCliente}</Text>
        <Text>Comentarios: {item.comentarios}</Text>
        <Text>Agente: {item.nombreAgente}</Text>
        <Text style={styles.fecha}>Fecha de Registro: {item.fecha}</Text>
        {item.imagenUri ? (
          <Image source={{ uri: item.imagenUri }} style={styles.imagen} />
        ) : (
          <Text style={styles.noImagen}>No hay imagen asociada</Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {isEditing ? (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.editTitle}>Editar Llamada</Text>
          <TextInput
            label="Nombre Cliente"
            value={editDatos.nombreCliente}
            onChangeText={(text) => handleEditChange('nombreCliente', text)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Teléfono Cliente"
            value={editDatos.telefonoCliente}
            onChangeText={(text) => handleEditChange('telefonoCliente', text)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email Cliente"
            value={editDatos.emailCliente}
            onChangeText={(text) => handleEditChange('emailCliente', text)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Estado de la Llamada"
            value={editDatos.estadoLlamada}
            onChangeText={(text) => handleEditChange('estadoLlamada', text)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Comentarios"
            value={editDatos.comentarios}
            onChangeText={(text) => handleEditChange('comentarios', text)}
            mode="outlined"
            style={styles.input}
            multiline
          />
          <TextInput
            label="Duración de la Llamada"
            value={editDatos.duracionLlamada}
            onChangeText={(text) => handleEditChange('duracionLlamada', text)}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <Button mode="outlined" onPress={seleccionarImagen} style={styles.button}>
            Seleccionar Imagen
          </Button>
          {editDatos.imagenUri ? (
            <Image source={{ uri: editDatos.imagenUri }} style={styles.imagen} />
          ) : (
            <Text style={styles.noImagen}>No hay imagen seleccionada</Text>
          )}
          <View style={styles.editButtons}>
            <Button mode="contained" onPress={actualizarLlamada} style={styles.button}>
              Guardar
            </Button>
            <Button mode="text" onPress={cancelarEdicion} style={styles.button}>
              Cancelar
            </Button>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={llamadas}
          keyExtractor={(item) => item.id}
          renderItem={renderLlamada}
          ListEmptyComponent={<Text>No hay llamadas registradas.</Text>}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}
      {cargando && (
        <View style={styles.cargando}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando llamadas...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff7e6', // Fondo cálido.
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff0e5',
    borderColor: 'orange',
    borderWidth: 1,
  },
  cargando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fecha: {
    marginTop: 5,
    fontStyle: 'italic',
    color: 'orange',
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
  editTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'orange',
  },
  input: {
    marginBottom: 15,
    borderColor: 'orange',
    backgroundColor: '#fff7e6',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'orange',
  },
});
