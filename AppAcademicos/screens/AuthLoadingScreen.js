// AuthLoadingScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, StyleSheet, View } from 'react-native';
import { useUser } from './ManejoDatos';



const AuthLoadingScreen = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current; // Definir rotateAnim 
  const { setUser } = useUser(); // DATOS DEL USUARIO
  const navigation = useNavigation();
  const { token } = useUser();

  // Se replica esta funcion y la logica de notificaciones para que al momento de que
  // el usuario haya cerrado la aplicacion y el programa verifique si existe o no
  // el usuario, se vuelven a cargar la notificacion (cada item explicado en loginscreen.js)
  const subscribeToNotifications = async (item) => {
    try {
      const response = await fetch('https://api-appacademicos.uct.cl/FechasNotificaciones', {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${item}`, 
          'Content-Type': 'application/json' 
        }
      });
      const eventos = await response.json();

      if (eventos && eventos.length > 0) {
        eventos.forEach(evento => {
          const fechaEvento = new Date(evento.Fecha_inicio.replace(' ', 'T') + 'Z'); // Añadimos 'Z' para indicar UTC
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



// animacion de carga, al tener una sesion iniciada
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start(); 
    return () => {
      animation.stop(); // Limpiar la animacin al desmontar
    };
  }, [rotateAnim]);


  // Interpolar el valor de rotación
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Se utiliza useEffect para empezar la verificacion si es que existe un usuario en los datos
  // o no
  useEffect(() => {
    const checkUserSession = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData)); // Cargar el usuario si existe
        const storedToken = await AsyncStorage.getItem('token'); // Cargar el token
        subscribeToNotifications(storedToken); // llama denuevo a las notificaciones
        navigation.reset({ //reseteo de pila a 0 en menu main
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        navigation.reset({ // si no esta logeado o no se encuentra un usuario, se resetea la pila a 0 en el login
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };
    checkUserSession();
  }, [setUser, navigation]);

  // Al momento de hacer el proceso de carga, se muestra la foto de la universidad
  // y ademas el logo de la universidad con una animacion con rotateInterpolate
  // girando entre su propio eje.
  return (
    <ImageBackground
      source={require('../imagenes/Fondo.jpg')}
      style={styles.background} 
    >
      <View style={styles.container}>
        <Animated.Image
          source={require('../imagenes/UCT_logoC.png')} 
          style={[styles.loaderImage, { transform: [{ rotate: rotateInterpolate }] }]} 
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderImage: {
    width: 100, 
    height: 100,
  },
});

export default AuthLoadingScreen;
