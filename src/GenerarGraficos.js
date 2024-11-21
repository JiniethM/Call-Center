import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Button } from 'react-native-paper';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function GenerarGraficos() {
  const [llamadas, setLlamadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState('pie');

  useEffect(() => {
    obtenerLlamadas();
  }, []);

  const obtenerLlamadas = async () => {
    try {
      setCargando(true);
      const q = query(collection(db, 'llamadas'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const llamadasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setLlamadas(llamadasData);
    } catch (error) {
      console.error('Error al obtener las llamadas:', error);
      Alert.alert('Error', 'No se pudieron obtener los datos.');
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  const procesarDatosParaPie = () => {
    if (llamadas.length === 0) {
      return [{ name: 'Sin datos', llamadas: 0, color: '#d3d3d3', legendFontColor: '#7F7F7F', legendFontSize: 15 }];
    }

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const conteoDias = {};

    llamadas.forEach((llamada) => {
      const dia = diasSemana[llamada.createdAt?.getDay() || 0];
      conteoDias[dia] = (conteoDias[dia] || 0) + 1;
    });

    return Object.keys(conteoDias).map((dia, index) => ({
      name: dia,
      llamadas: conteoDias[dia],
      color: getColor(index),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  };

  const procesarDatosParaBar = () => {
    if (llamadas.length === 0) {
      return {
        labels: ['Sin datos'],
        datasets: [
          {
            data: [0],
          },
        ],
      };
    }
    const etiquetas = llamadas.map((_, index) => `Llamada ${index + 1}`);
    const duraciones = llamadas.map((llamada) => llamada.duracionLlamada || 0);
    return {
      labels: etiquetas,
      datasets: [
        {
          data: duraciones,
        },
      ],
    };
  };

  const getColor = (index) => {
    const colores = ['#ffd6a5', '#ffadad', '#caffbf', '#9bf6ff', '#a0c4ff', '#ffc6ff', '#bdb2ff'];
    return colores[index % colores.length];
  };

  const generarPDF = async () => {
    const dataPie = procesarDatosParaPie();
    const dataBar = procesarDatosParaBar();

    const filasTablaPie = dataPie
      .map(
        (d) => `
        <tr>
          <td style="padding: 10px; text-align: left; color: #555;">${d.name}</td>
          <td style="padding: 10px; text-align: center; color: #555;">${d.llamadas}</td>
          <td style="padding: 10px; text-align: center; background-color: ${d.color};"></td>
        </tr>
      `
      )
      .join('');

    const filasTablaBar = dataBar.labels
      .map(
        (label, index) => `
        <tr>
          <td style="padding: 10px; text-align: left; color: #555;">${label}</td>
          <td style="padding: 10px; text-align: center; color: #555;">${dataBar.datasets[0].data[index]}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              padding: 0;
              color: #333;
            }
            h1 {
              color: #ff6f00;
              text-align: center;
            }
            h3 {
              color: #ffa500;
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #ffcc80;
              color: #333;
              padding: 10px;
              text-align: center;
            }
            td {
              border: 1px solid #ddd;
              padding: 10px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Llamadas</h1>

          <h3>Gráfico de Pastel</h3>
          <p style="text-align: center;">A continuación se muestran los datos utilizados en el gráfico pastel:</p>
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Número de Llamadas</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              ${filasTablaPie}
            </tbody>
          </table>

          <h3>Gráfico de Barras</h3>
          <p style="text-align: center;">A continuación se muestran los datos utilizados en el gráfico de barras:</p>
          <table>
            <thead>
              <tr>
                <th>Llamada</th>
                <th>Duración (min)</th>
              </tr>
            </thead>
            <tbody>
              ${filasTablaBar}
            </tbody>
          </table>

          <p class="footer">
            Este reporte fue generado automáticamente desde Call Center. <br>
            ¡Gracias por usar nuestros servicios!
          </p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('PDF generado', `El archivo está disponible en: ${uri}`);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          obtenerLlamadas();
        }} />
      }
    >
      {cargando ? (
        <View style={styles.cargando}>
          <ActivityIndicator size="large" color="#ffa500" />
          <Text style={styles.cargandoTexto}>Cargando datos...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.titulo}>Gráfico de Llamadas</Text>
          {tipoGrafico === 'pie' ? (
            <PieChart
              data={procesarDatosParaPie()}
              width={Dimensions.get('window').width - 40}
              height={250}
              chartConfig={{
                backgroundColor: 'transparent',
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="llamadas"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <BarChart
              data={procesarDatosParaBar()}
              width={Dimensions.get('window').width - 40}
              height={250}
              yAxisSuffix=" min"
              chartConfig={{
                backgroundColor: '#ffa500',
                backgroundGradientFrom: '#ffa500',
                backgroundGradientTo: '#ffcc80',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.grafico}
            />
          )}

          <Button
            mode="contained"
            onPress={() => setTipoGrafico(tipoGrafico === 'pie' ? 'bar' : 'pie')}
            style={[styles.button, { backgroundColor: 'orange' }]}
            labelStyle={{ color: '#fff' }}
          >
            Cambiar a {tipoGrafico === 'pie' ? 'Gráfico de Barras' : 'Gráfico de Pastel'}
          </Button>
          <Button
            mode="contained"
            onPress={generarPDF}
            style={[styles.button, { backgroundColor: 'orange' }]}
            labelStyle={{ color: '#fff' }}
          >
            Generar PDF
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff7e6',
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    marginTop: 10,
    color: 'orange',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'orange',
  },
  grafico: {
    marginVertical: 10,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
  },
});
