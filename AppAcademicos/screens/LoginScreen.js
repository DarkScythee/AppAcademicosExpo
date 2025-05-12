import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUser } from './ManejoDatos';

//Imagenes
const uctImage = require('../imagenes/Fondo.jpg');
const uctLogo = require('../imagenes/LogoUCT.png');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { storeUserData } = useUser();

  // Validación de correo electrónico con expresión regular
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const ContraseñaOlvidar = () => {
    // Abrir la URL en el navegador
    Linking.openURL('https://campusid.uct.cl/').catch((err) => console.error('Error al abrir la URL:', err));
  };

  const authenticateUser = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    if (!isValidEmail(correo)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      const response = await fetch('https://api-appacademicos.uct.cl/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          func_email: correo,
          func_password: contrasena,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        await storeUserData(data.data, data.Token);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
        subscribeToNotifications(data.Token);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert('Error', 'Error de red. Por favor, intenta de nuevo.');
    }
  };

  const subscribeToNotifications = async (item) => {
    try {
      const response = await fetch('https://api-appacademicos.uct.cl/FechasNotificaciones', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${item}`,
          'Content-Type': 'application/json',
        },
      });
      const eventos = await response.json();

      if (eventos && eventos.length > 0) {
        eventos.forEach((evento) => {
          const fechaEvento = new Date(evento.Fecha_inicio.replace(' ', 'T') + 'Z');
          scheduleNotification(evento.Nombre_evento, fechaEvento);
        });
      } else {
        console.log('No hay eventos para mostrar.');
      }
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };

  const scheduleNotification = async (nombreEvento, fechaEvento) => {
    if (fechaEvento > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio de evento',
          body: nombreEvento,
          sound: 'default',
        },
        trigger: fechaEvento,
      });
    } else {
      console.log(`La fecha del evento "${nombreEvento}" ya ha pasado.`);
    }
  };

  // Función para enviar notificación de prueba
  const sendTestNotification = async () => {
    // Verificar permisos
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permisos de notificación', 'No se han concedido permisos para recibir notificaciones.');
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Notificación de prueba',
    body: '¡Esta es una notificación de prueba en iOS!',
    sound: 'default',
  },
  trigger: { seconds: 5 }, // ✅ Dispara en 5 segundos
});

    Alert.alert("Notificación programada", "Se ha programado una notificación de prueba.");
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={uctImage} style={styles.image}>
        <Image style={styles.tinyLogo} source={uctLogo} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo Institucional"
            placeholderTextColor="black"
            textAlign="left"
            autoCorrect={false}
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
            allowFontScaling={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="black"
            textAlign="left"
            secureTextEntry
            autoCorrect={false}
            autoCapitalize="none"
            value={contrasena}
            onChangeText={setContrasena}
            allowFontScaling={false}
          />
          <Pressable style={styles.button} onPress={authenticateUser}>
            <Text style={styles.buttonText} allowFontScaling={false}>
              Iniciar Sesion
            </Text>
          </Pressable>
          <Pressable onPress={ContraseñaOlvidar}>
            <Text style={styles.forgetText} allowFontScaling={false}>
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>
          <Pressable style={styles.button} onPress={sendTestNotification}>
            <Text style={styles.buttonText} allowFontScaling={false}>
              Enviar Notificación de Prueba
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 130,
    height: 100,
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: '#ECECEC90',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -200,
    width: '90%',
    alignSelf: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    fontSize: 15,
    borderRadius: 7,
    width: '100%',
  },
  button: {
    backgroundColor: '#2195F2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
  forgetText: {
    color: '#2195F2',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 17,
  },
});

export default LoginScreen;
