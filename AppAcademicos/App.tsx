import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import LoginScreen from './screens/LoginScreen';
import { UserProvider, useUser } from './screens/ManejoDatos'; // Asegúrate de la ruta correcta
import CalendarioAcademico from './screens/ScreensMain/CalendarioAca';
import CargaAcademica from './screens/ScreensMain/CargaAcademica';
import FormularioDirectorio from './screens/ScreensMain/Directorio';
import PantallaPrincipal from './screens/ScreensMain/Principal';
// @ts-ignore

// Imagenes
const homeIcon = require('./imagenes/home.png');
const calendarIcon = require('./imagenes/calendar.png');
const Academico = require('./imagenes/Academico.png');
const Mensajes = require('./imagenes/Mensajes.png');
const MenuB = require('./imagenes/menu3.png');
const closeIcon = require('./imagenes/flecha_derecha.png'); 

// constantres de navigator, drawernavigator y tabnavigator para navegar entre pantallas, y menus.
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');
const isTablet = Device.deviceType === Device.DeviceType.TABLET;
// ---------------VARIABLES PARA CONFIGURACION DE MENU LATERAL--------------
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { clearUserData } = useUser();

  // Estado para gestionar si la notificacion esta activada o desactivadaa 1
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // Estado para gestionar si la notificacion esta activada o desactivadaa 2
  const [isEnabled2, setIsEnabled2] = useState(false);
  const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);

  //----------------------Preferencias--------------------------------
  // Estado para gestionar si la notificacion esta activada o desactivadaa 1
  const [isEnabled3, setIsEnabled3] = useState(false);
  const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);
  // Estado para gestionar si la notificacion esta activada o desactivadaa 2
  const [isEnabled4, setIsEnabled4] = useState(false);
  const toggleSwitch4 = () => setIsEnabled4(previousState => !previousState);
  // Estado para gestionar si la notificacion esta activada o desactivadaa 3
  const [isEnabled5, setIsEnabled5] = useState(false);
  const toggleSwitch5 = () => setIsEnabled5(previousState => !previousState);
  // Estado para gestionar si la notificacion esta activada o desactivadaa 4
  const [isEnabled6, setIsEnabled6] = useState(false);
  const toggleSwitch6 = () => setIsEnabled6(previousState => !previousState);



// COMPONENTE PARA CERRAR SESION, DESACTIVARR NOTIFICACIONES, LIMPIAR DATOS, RESETEAR PILA DE NAVEGACION
  const handleLogout = async () => {
    await clearUserData();
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  
  //---------------menu de configuraciones lateral izquierdo----------------------
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        {/* El contenido principal de la configuración */}
        <View style={styles.contenedor}>
          <Text style={styles.headerText} allowFontScaling={false}>Configuración</Text>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
            <Image source={closeIcon} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator3}></View>

        {/*}
        <View style={styles.rowTodo}>
          <Text style={styles.label} allowFontScaling={false}>Activar notificaciones</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={toggleSwitch}
            thumbColor={isEnabled ? "#ffffff" : "#e7e4e4"}
            value={isEnabled}
          />
        </View>
        <View style={styles.rowTodo2}>
          <Text style={styles.label} allowFontScaling={false}>Activar para mostrarse conectado</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={toggleSwitch2}
            thumbColor={isEnabled2 ? "#ffffff" : "#e7e4e4"}
            value={isEnabled2}
          />
        </View>
        <View style={styles.separator}></View>
  
        <Text style={styles.TextPreferencia} allowFontScaling={false}>Preferencias de notificaciones</Text>
  

        <View style={styles.rowTodo2}>
          <Text style={styles.label} allowFontScaling={false}>Notificaciones de Académicos</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={toggleSwitch3}
            thumbColor={isEnabled3 ? "#ffffff" : "#e7e4e4"}
            value={isEnabled3}
          />
        </View>
        <View style={styles.rowTodo2}>
          <Text style={styles.label} allowFontScaling={false}>Notificaciones de Carreras</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={toggleSwitch4}
            thumbColor={isEnabled4 ? "#ffffff" : "#e7e4e4"}
            value={isEnabled4}
          />
        </View>
        <View style={styles.rowTodo2}>
          <Text style={styles.label} allowFontScaling={false}>Notificaciones de Docentes</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={toggleSwitch5}
            thumbColor={isEnabled5 ? "#ffffff" : "#e7e4e4"}
            value={isEnabled5}
          />
        </View>
        <View style={styles.rowTodo2}>
          <Text style={styles.label} allowFontScaling={false}>Notificaciones de Comunidad</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={toggleSwitch6}
            thumbColor={isEnabled6 ? "#ffffff" : "#e7e4e4"}
            value={isEnabled6}
          />
        </View>
        <View style={styles.separator}></View>
        <View style={styles.spacer}></View>
        <View style={styles.separator}></View>
        {/* Contenedor para el botón "Cerrar sesión" */}
        <View style={styles.bottomContainer}>
          <DrawerItem
            label={({ focused, color }) => (
              <Text style={{ color: 'red', marginLeft: 5 }} allowFontScaling={false}>
                Cerrar Sesión
              </Text>
            )}
            onPress={handleLogout}
          />
        </View>
      </View>
      
    </DrawerContentScrollView>
  );
  
};


// Constante para asignatura una pantalla, a un componente de nombre Home, 
const MainScreenDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '100%',
        },
      }}
      
    >
      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
      />
    </Drawer.Navigator>
  );
};

// Tabnavigator es el menu inferior con todos los estilos que posee para que quede
// de la manera en la que esta.
const TabNavigator = () => {

const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false, 
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 20,
          right: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          backgroundColor: 'white',
          borderRadius: 10,
          height: 50,
          borderWidth: 0.2,
        },
        // Cambia los colores de los íconos
        tabBarActiveTintColor: '#0056b3',  // Azul más oscuro o un color más vibrante
        tabBarInactiveTintColor: '#7f7f7f',
        headerTitleAlign: 'center',
      })}
    >

    {/*------------------Esta son las pantallas del menu inferior que direcciona a cada modulo---------------*/}
    <Tab.Screen 
  name="Pantalla Principal" 
  component={PantallaPrincipal}
  options={({ navigation }) => ({
    tabBarIcon: ({ color }) => (
      <Image source={homeIcon} style={[styles.icon, { tintColor: color }]} />
    ),
    tabBarLabel: () => null, // No mostrar etiqueta
    headerShown: true,
    tabBarStyle: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? insets.bottom + -5 : insets.bottom + 0,  // 10 para iOS y 20 para Android
      left: 20,
      right: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      backgroundColor: 'white',
      borderRadius: 10,
      height: isTablet ? 70 : 50, // 👈 Cambia solo en tablet
      borderWidth: 0.2,
    },
    
    headerTitle: () => null, // No mostrar título en el encabezado
    headerLeft: () => (
      <TouchableOpacity 
         onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
        style={{ zIndex: 1, position: 'absolute' }} 
        hitSlop={{ top: 30, bottom: 50, left: 30, right: 20 }} // Aumenta el área tocable
      >
        <Image source={MenuB} style={styles.icon2} />
      </TouchableOpacity>
    ),
    headerStyle: {
      backgroundColor: 'transparent', // Fondo del encabezado transparente
      elevation: 0, // Eliminar sombra en Android
      shadowOpacity: 0, // Eliminar sombra en iOS
      height: 0, // Altura mínima para el encabezado
      borderBottomWidth: 0, // Eliminar la línea inferior
    },
  })} 
/>

      {/*Pantalla del calendario academico */}
      <Tab.Screen 
        name="Calendario institucional" 
        component={CalendarioAcademico}
        options={{
          tabBarIcon: ({ color }) => <Image source={calendarIcon} style={[styles.icon, { tintColor: color }]} />,
          title: 'Calendario Institucional',
          tabBarLabel: () => null,
          headerShown: false,
          tabBarStyle: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? insets.bottom + -5 : insets.bottom + 0,  // 10 para iOS y 20 para Android
      left: 20,
      right: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      backgroundColor: 'white',
      borderRadius: 10,
      height: isTablet ? 70 : 50, // 👈 Cambia solo en tablet
      borderWidth: 0.2,
    },
        }} 
      />
       {/*Pantalla de la carga academica */}
      <Tab.Screen 
        name="Carga Académica" 
        component={CargaAcademica}
        options={{
          tabBarIcon: ({ color }) => <Image source={Academico} style={[styles.icon, { tintColor: color }]} />,
          title: 'Carga Académica',
          tabBarLabel: () => null,
          headerShown: false, // No mostrar encabezado
          tabBarStyle: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? insets.bottom + -5 : insets.bottom + 0,  // 10 para iOS y 20 para Android
      left: 20,
      right: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      backgroundColor: 'white',
      borderRadius: 10,
      height: isTablet ? 70 : 50, // 👈 Cambia solo en tablet
      borderWidth: 0.2,
    },
        }} 
      />
       {/*Pantalla del directorio */}
      <Tab.Screen 
        name="Directorio" 
        component={FormularioDirectorio}
        options={{
          tabBarIcon: ({ color }) => <Image source={Mensajes} style={[styles.icon, { tintColor: color }]} />,
          title: 'Directorio',
          tabBarLabel: () => null,
          headerShown: false, // No mostrar encabezado
          tabBarStyle: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? insets.bottom + -5 : insets.bottom + 0,  // 10 para iOS y 20 para Android
      left: 20,
      right: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      backgroundColor: 'white',
      borderRadius: 10,
      height: isTablet ? 70 : 50, // 👈 Cambia solo en tablet
      borderWidth: 0.2,
    },
        }} 
      />
    </Tab.Navigator>
  );
};
//-------------------------------------------------------------------------------------------------------

// App envuelta en userprovider para utilizar el manejo de datos y tokens del usuario, ademas de la configuracion
// de react-navigator, para la navegacion entre pantallas.
// ruta inicial AuthloadingScreen encargada de vlidar si se encuentra un usuario o no
const App = () => {
  
  useEffect(() => {
    // Configurar notificaciones push al inicio
    const registerForPushNotificationsAsync = async () => {
      try {
        // Solicitar permisos si estamos en iOS
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') {
            //console.log('Permisos de notificación no concedidos');
            return;
          }
        }


        // Obtener el token de notificación para Expo Push
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Expo push token:', token.data);

        // Puedes almacenar el token en un estado o enviarlo a tu servidor si es necesario
      } catch (error) {
        //console.error('Error obtaining notification token:', error);
      }
    };

    // Configuración de la recepción de notificaciones
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    // 👇 Este bloque muestra alertas de notificaciones en primer plano
      Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,  // Necesario para iOS
      shouldShowList: true,    // También necesario para iOS
    }),
  });



    // Llamar a la función para registrar las notificaciones
    registerForPushNotificationsAsync();

    // Limpieza al desmontar el componente
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // Configuración de la barra de estado
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        StatusBar.setBackgroundColor('rgb(51, 177, 227)');
        StatusBar.setTranslucent(true);
      } catch (error) {
        console.error('Error configurando la barra de estado:', error);
      }
    }
  }, []);

  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoadingScreen">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainScreenDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CargaAcademicaA" component={CargaAcademica} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  </UserProvider>
  );
};


const styles = StyleSheet.create({
  drawerContent: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,  // 10 para iOS y 20 para Android
    padding: Platform.OS === 'ios' ? 0 : 0, // Mueve todo el contenido hacia la izquierda solo en iOS
    right: Platform.OS === 'ios' ? 0 : 0, // Mueve todo el contenido hacia la izquierda solo en iOS
  },
  closeIcon: {
    width: 24,  // Ajusta según el tamaño deseado
    height: 24,
    alignSelf: 'flex-end', // Para alinear el ícono a la derecha

  },
  icon: {
  width: 28,
  height: 28,
  marginTop: isTablet ? 30 : 10, // 👈 Espaciado fino vertical adaptable

},

  icon2: {
    width: 30,
    top: 40,
    height: 30,
    marginLeft: 20, 
  },
  
  closeButton: {
    alignSelf: 'flex-end',

  },
  
  headerText: {
    fontSize: 24,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
  TextPreferencia: {
    fontSize: 20,
    paddingHorizontal: 15,        // Espaciado horizontal
    paddingVertical: 10,          // Espaciado vertical
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    marginTop: 10,
  },
  menuItemsContainer: {

  },
  contenedor: {
    flexDirection: 'row',         // Establece una fila horizontal
    justifyContent: 'space-between', // Distribuye el espacio entre los elementos
    alignItems: 'center',         // Centra los elementos verticalmente
    paddingHorizontal: 20,        // Espaciado horizontal
    marginBottom: 10,

  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#d3d3d3',
  },
  separator2: {
    height: 1,
    width: '100%',
    backgroundColor: '#d3d3d3',
  },
  separator3: {
    height: 1,
    width: '100%',
    backgroundColor: '#d3d3d3',
    marginBottom: 5,
    
  },
  label: {
    fontSize: 18,
    marginRight: 10,  // Espacio entre el texto y el switch
    color: '#7c7c7c',
  },
  rowTodo: {
    flexDirection: 'row',         // Establece una fila horizontal
    justifyContent: 'space-between', // Distribuye el espacio entre los elementos
    paddingHorizontal: 20,        // Espaciado horizontal
    paddingVertical: 10,          // Espaciado vertical
  },
  rowTodo2: {
    flexDirection: 'row',         // Establece una fila horizontal
    justifyContent: 'space-between', // Distribuye el espacio entre los elementos
    paddingHorizontal: 20,        // Espaciado horizontal
    paddingBottom: 10,
  },

  bottomContainer: {
    marginTop: 'auto',  // Empuja el botón hacia el final de la pantalla
  },
  spacer: {
    flex: 1,  // Hace que este espacio ocupe todo el espacio vacío disponible
  },
});

export default App;
