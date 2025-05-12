// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // estado para el usuario
  const [token, setToken] = useState(null); // Estado para el token

  // Cargar usuario al inicio
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('user'); // Cargar datos de usuario
      const storedToken = await AsyncStorage.getItem('token'); // Cargar el token
      if (userData) {
        setUser(JSON.parse(userData)); // Parsear el JSON almacenado
      }
      if (storedToken) {
        setToken(storedToken); // Almacenar el token en el estado
      }
    };
    loadUserData();
  }, []);

  // Esta funcion se encarga de almacenar los datos del usuario
  const storeUserData = async (userData,userToken) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData)); // Guardar como JSON
    await AsyncStorage.setItem('token', userToken); // Guardar el token
    setUser(userData); // Actualizar el estado del usuario
    setToken(userToken); // Actualizar el estado del token
  };

  // Esta funcion se encarga de limpiar los datos del usuario con la funcion removeItem
  const clearUserData = async (navigation) => {
    //setUser(null); // Actualizar el estado primero
    await AsyncStorage.removeItem('user'); // Limpiar almacenamiento
    await AsyncStorage.removeItem('token'); // Limpiar almacenamiento
  };

  //Retorna los estados de cada variable para utilizar o actualizar en otra pantallas
  return (
    <UserContext.Provider value={{ user, setUser, storeUserData, clearUserData, token }}>
      {children}
    </UserContext.Provider>
  );
};
//Use context utilizado en pantallas para obtencion de datos, por eso se exporta
export const useUser = () => useContext(UserContext);
export { UserContext };