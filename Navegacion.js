import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/firebaseConfig';
import PantallaLogin from './pages/login';
import Encabezado from './src/Encabezado';
import FormularioLlamada from './src/FormularioLlamada';
import ListaLlamadas from './src/ListaLlamadas';
import GenerarGraficos from './src/GenerarGraficos';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Encabezado" 
        component={Encabezado} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="FormularioLlamada" 
        component={FormularioLlamada} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-call" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ListaLlamadas" 
        component={ListaLlamadas} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="GenerarGraficos" 
        component={GenerarGraficos} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe; // Limpia el listener al desmontar el componente
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!usuario ? (
          <Stack.Screen name="Login" component={PantallaLogin} />
        ) : (
          <Stack.Screen name="Home" component={MyTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
