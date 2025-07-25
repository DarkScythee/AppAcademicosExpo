import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, FlatList, Image, ImageBackground, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useUser } from '../ManejoDatos';

const BuscadorD = require('../../imagenes/lupa.png');
const BorradorT = require('../../imagenes/delete.png');
const uctImage = require('../../imagenes/back.jpg');
const background123 = require('../../imagenes/back.jpg');
const flecha_blanca = require('../../imagenes/flecha_blanca.png');
const LupaDirectorio = require('../../imagenes/LupaDirectorio.png');
const filtrar = require('../../imagenes/flecha_abajo.png');
const filtroImage = require('../../imagenes/filtrarimage.png');
const catolicafondo = require('../../imagenes/cato_fondo.jpg');
const UCTLOGOHD = require('../../imagenes/LogoUCT.png');
// Modal icons
const telefonochico = require('../../imagenes/call.png');
const correeochico = require('../../imagenes/email.png');
const messagee = require('../../imagenes/message.png');
const usuarioSino = require('../../imagenes/usuarioSino.png');

// Imagenes Directorio Modal
const pastel = require('../../imagenes/pastel.png');
const cargo = require('../../imagenes/cargo.png');
const edificio = require('../../imagenes/edificio.png');
const mapaLogo = require('../../imagenes/mapaLogo.png');


const FormularioDirectorio = () => {
  const { token } = useUser();
  const [selected, setSelected] = useState('Académicos');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [dataA, setDataA] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [placeholder, SetPlaceholder] = useState('Buscar Funcionarios');
  const [unidadD, setUnidadD] = useState('');
  const [cargoD, setCargoD] = useState('');

   const [fontsLoaded] = useFonts({
          Ultra: require('../../assets/fonts/Montserrat-Bold.ttf'),
          Ultra2: require('../../assets/fonts/Montserrat-SemiBold.ttf')
      })

  //Tipo
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  //Unidad
  const [UnidadOpen, setUnidadOpen] = useState(false); 
  const [selectedUnidad, setselectedUnidad] = useState(null);
  const [unidades, setUnidades] = useState([]);

  //Cargo
  const [CargoOpen, setCargoOpen] = useState(false); 
  const [selectedCargo, setselectedCargo] = useState(null);
  const [Cargos, setCargos] = useState([]);

  // Edificio

  const [EdificioOpen, setEdificioOpen] = useState(false); 
  const [selectedEdificio, setselectedEdificio] = useState(null);
  const [Edificio, setEdificio] = useState([]);

  //Campus

  const [CampusOpen, setCampusOpen] = useState(false); 
  const [selectedCampus, setselectedCampus] = useState(null);
  const [Campus, setCampus] = useState([]);

  //Carrera
  const [CarreraOpen, setCarreraOpen] = useState(false); 
  const [selectedCarrera, setselectedCarrera] = useState(null);
  const [Carrera, setCarrera] = useState([]);

  //Lat,Long
  const [datalatitud, Setdatalatitud] = useState([]);


  //MODALES

  //Modal 1
  const [selectedUnidadLabel1, setselectedUnidadLabel1] = useState('');
  const [showUnidadModal1, setShowUnidadModal1] = useState(false);
  //Modal 2
  const [selectedUnidadLabel2, setselectedUnidadLabel2] = useState('');
  const [showUnidadModal2, setShowUnidadModal2] = useState(false);
  //Modal 3
  const [selectedUnidadLabel3, setselectedUnidadLabel3] = useState('');
  const [showUnidadModal3, setShowUnidadModal3] = useState(false);
  //Modal 4
  const [selectedUnidadLabel4, setselectedUnidadLabel4] = useState('');
  const [showUnidadModal4, setShowUnidadModal4] = useState(false);
  //Modal 5
  const [selectedUnidadLabel5, setselectedUnidadLabel5] = useState('');
  const [showUnidadModal5, setShowUnidadModal5] = useState(false);
  //Filtros mostrar
  const [listaFinal, setListaFinal] = useState([]);
  const [seleccionados, setSeleccionados] = useState({
  unidad: null,
  cargo: null,
  edificio: null,
  campus: null,
  carrera: null,
});

//const para busqueda dinamica filtros:

const [searchUnidad, setSearchUnidad] = useState('');
const [filteredUnidades, setFilteredUnidades] = useState(unidades);

const [searchCargo, setSearchCargo] = useState('');
const [filteredCargos, setFilteredCargos] = useState(Cargos);

const [searchEdificio, setSearchEdificio] = useState('');
const [filteredEdificios, setFilteredEdificios] = useState(Edificio);

const [searchCampus, setSearchCampus] = useState('');
const [filteredCampus, setFilteredCampus] = useState(Campus);

const [searchCarrera, setSearchCarrera] = useState('');
const [filteredCarreras, setFilteredCarreras] = useState(Carrera);

//------------------------Busqueda dinamica filtros---------------------------

useEffect(() => {
  if (showUnidadModal1) {
    setFilteredUnidades(unidades); // Mostrar todos al abrir
    setSearchUnidad('');           // Limpiar la búsqueda
  }
}, [showUnidadModal1]);

useEffect(() => {
  if (showUnidadModal2) {
    setFilteredCargos(Cargos); // Mostrar todos al abrir
    setSearchCargo('');           // Limpiar la búsqueda
  }
}, [showUnidadModal2]);

useEffect(() => {
  if (showUnidadModal3) {
    setFilteredEdificios(Edificio); // Mostrar todos al abrir
    setSearchEdificio('');           // Limpiar la búsqueda
  }
}, [showUnidadModal3]);

useEffect(() => {
  if (showUnidadModal4) {
    setFilteredCampus(Campus); // Mostrar todos al abrir
    setSearchCampus('');           // Limpiar la búsqueda
  }
}, [showUnidadModal4]);

useEffect(() => {
  if (showUnidadModal5) {
    setFilteredCarreras(Carrera); // Mostrar todos al abrir
    setSearchCarrera('');           // Limpiar la búsqueda
  }
}, [showUnidadModal5]);

//---------------------------------------------------------------------------------

  useEffect(() => {
    fetchCargos();
    fetchUnidades();
    fetchCarreras();
    fetchEdificios();
    fetchCampus();
    
  }, []);

  
// Meses del año para mostrar el cumpleaños del academico
  const meses = {
    '01': 'ENERO',
    '02': 'FEBRERO',
    '03': 'MARZO',
    '04': 'ABRIL',
    '05': 'MAYO',
    '06': 'JUNIO',
    '07': 'JULIO',
    '08': 'AGOSTO',
    '09': 'SEPTIEMBRE',
    '10': 'OCTUBRE',
    '11': 'NOVIEMBRE',
    '12': 'DICIEMBRE'
};

const resetFilters = () => {
  // Reset categoría
  setSelected('Académicos');

  // Reset Unidad
  setUnidadD('');
  setselectedUnidad('');
  setselectedUnidadLabel1('');

  // Reset Cargo
  setCargoD('');
  setselectedCargo('');
  setselectedUnidadLabel2('');

  // Reset Edificio
  setselectedEdificio('');
  setselectedUnidadLabel3('');

  // Reset Campus
  setselectedCampus('');
  setselectedUnidadLabel4('');

  // Reset Carrera
  setselectedCarrera('');
  setselectedUnidadLabel5('');

  // Reset TextInput de búsqueda
  setSearchTerm('');


  // Resetear 
  SetPlaceholder('Buscar Funcionarios');

  // Cerrar modales si estuvieran abiertos (opcional pero útil)
  setShowUnidadModal1(false);
  setShowUnidadModal2(false);
  setShowUnidadModal3(false);
  setShowUnidadModal4(false);
  setShowUnidadModal5(false);

  setListaFinal([]);
  setSeleccionados([]);
  setData([]);

};


const applyFilters = () => {

  // Obtener texto de los labels (null si vacío)
  const unidad = selectedUnidadLabel1 && selectedUnidadLabel1.trim() !== '' ? selectedUnidadLabel1 : 'null';
  const cargo = selectedUnidadLabel2 && selectedUnidadLabel2.trim() !== '' ? selectedUnidadLabel2 : 'null';
  const campus = selectedUnidadLabel4 && selectedUnidadLabel4.trim() !== '' ? selectedUnidadLabel4 : 'null';
  const edificio = selectedUnidadLabel3 && selectedUnidadLabel3.trim() !== '' ? selectedUnidadLabel3 : 'null';

  // Mostrar en consola (debug)
  console.log({
    selected,
    unidad,
    cargo,
    campus,
    edificio
  });

  // Aplicar filtros
  if (selected === 'Académicos') {
    fetchDataG(searchTerm); // Llama con string vacío si no hay searchTerm
  } else if (selected === 'Alumnos') {
    fetchDataA(searchTerm); // También puedes llamar a fetchDataA sin término
  }

  setIsOpen(false); // Cierra el modal si es necesario
  setListaFinal(Object.values(seleccionados).filter(Boolean));

};


function convertirFecha(fecha) {
  if (!fecha || typeof fecha !== 'string') {
    return 'Fecha no disponible';
  }

  const [mes, dia] = fecha.split('-');
  return `${dia} DE ${meses[mes] || 'MES DESCONOCIDO'}`;
}

// convierte la fecha y retorna el dia y mes ordenado para el modal de informacion
// del academico
function probar(item){
  return convertirFecha(item);
};


// Retorna a Google Maps con las latitudes y longitudes
const PruebaVariable = async (code) => {
  const fechas = await fetchUbicaciones2(code);
  console.log(fechas);

  // Verifica si se recibió al menos una ubicación
  if (!fechas || fechas.length === 0) {
    Alert.alert(
      'Ubicación no disponible',
    );
    return;
  }

  // Verifica si todas las ubicaciones tienen latitud y longitud como null
  const ubicacionesNulas = fechas.every(
    (item) => item.latitud_edificio === null || item.longitud_edificio === null
  );

  if (ubicacionesNulas) {
    Alert.alert(
      'Ubicación no disponible',
    );
    return;
  }


  const { latitud_edificio, longitud_edificio } = fechas[0]; // Tomamos la primera ubicación
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitud_edificio},${longitud_edificio}`;

  Linking.openURL(url).catch(err => console.error('Error opening map: ', err));
};


  // Estado y referencia para la animación
  const animationValue = useRef(new Animated.Value(0)).current;


{/*--------------------------------------------Ubicaciones SYNC--------------------------------------------- */}
const fetchUbicaciones2 = async (term) => {
  try {
    const response = await fetch(`https://api-appacademicos.uct.cl/ubicacioneslatlon?inmu_sigla=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data7 = await response.json();

    const datatodo = data7.map(item => ({
      ...item,  // Mantener todos los campos del item original
    }));

    Setdatalatitud(datatodo);  // Guardar el JSON completo en el estado
    //console.log('Ubicaciones cargadas:', datatodo);  // Mostrar el JSON completo en consola
    return datatodo; // <-- ¡IMPORTANTE!
  } catch (error) {
    console.error('Error fetching unidades:', error);
  } finally {
    setIsFetching(false);  // Restablecer el estado de carga
  }
};
{/*--------------------------------------------Ubicaciones SYNC--------------------------------------------- */}



 {/*--------------------------------------------UNIDADES SYNC--------------------------------------------- */}
 const fetchUnidades = async () => {

  try {
    const response = await fetch('https://api-appacademicos.uct.cl/unidades', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data4 = await response.json();
    const updatedUnidades = data4.map(item => ({
      ...item,  // Mantener todos los campos del item original
      ID: item.ID.toString(),  // Asegurarte que ID sea un string
    }));

    setUnidades(updatedUnidades);  // Guardar el JSON completo en el estado
    //console.log('Unidades cargadas:', updatedUnidades);  // Mostrar el JSON completo en consola
  } catch (error) {
    //console.error('Error fetching unidades:', error);
  } finally {
    setIsFetching(false);  // Restablecer el estado de carga
  }
};
 {/*--------------------------------------------UNIDADES SYNC--------------------------------------------- */}

{/*---------------------------------------------CARGOS SYNC--------------------------------------------- */}
const [isFetching, setIsFetching] = useState(false);
const [retryCount, setRetryCount] = useState(0);
const maxRetries = 5;

const fetchCargos = async () => {
  if (isFetching) return; // evitar llamadas simultáneas

  setIsFetching(true);

  try {
    const response = await fetch(`https://api-appacademicos.uct.cl/cargos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data6 = await response.json();

    const updatedUnidades = data6.map(item => ({
      ...item,
      ID: item.ID.toString(), // asumiendo que ya son únicos
    }));

    setCargos(updatedUnidades);
    setRetryCount(0); // reset retry count al tener éxito

  } catch (error) {
    //console.error('Error fetching cargos:', error);

    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Reintentar después de 1 segundo
      setTimeout(() => {
        fetchCargos();
      }, 1000);
    } else {
      console.error('Máximo número de reintentos alcanzado.');
    }
  } finally {
    setIsFetching(false);
  }
};



{/*---------------------------------------------CARGOS SYNC--------------------------------------------- */}

{/*---------------------------------------------EDIFICIOS SYNC--------------------------------------------- */}
const fetchEdificios = async () => {
  try {
    const response = await fetch(`https://api-appacademicos.uct.cl/edificios`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data7 = await response.json();
    const updatedEdificios = data7.map(item => ({
      ...item,  // Mantener todos los campos del item original
      ID: item.ID.toString(),  // Asegurarte que ID sea un string
    }));

    setEdificio(updatedEdificios);  // Guardar el JSON completo en el estado
    //console.log('Edificios cargadas:', updatedEdificios);  // Mostrar el JSON completo en consola
  } catch (error) {
    //console.error('Error fetching unidades:', error);
  } finally {
    setIsFetching(false);  // Restablecer el estado de carga
  }
};
{/*---------------------------------------------EDIFICIOS SYNC--------------------------------------------- */}

{/*---------------------------------------------CAMPUS SYNC--------------------------------------------- */}
const fetchCampus = async () => {
  try {
    const response = await fetch(`https://api-appacademicos.uct.cl/campus`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const updatedCampus = data.map(item => ({
      ...item,  // Mantener todos los campos del item original
      ID: item.ID.toString(),  // Asegurarte que ID sea un string
    }));

    setCampus(updatedCampus);  // Guardar el JSON completo en el estado
    //console.log('Campus cargadas:', updatedCampus);  // Mostrar el JSON completo en consola
  } catch (error) {
    //console.error('Error fetching unidades:', error);
  } finally {
    setIsFetching(false);  // Restablecer el estado de carga
  }
};
{/*---------------------------------------------CAMPUS SYNC--------------------------------------------- */}

{/*----------------------------------------------CARRERAS--------------------------------------------- */}
  const fetchCarreras = async () => {

  try {
    const response = await fetch('https://api-appacademicos.uct.cl/obtenerCarrera', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data5 = await response.json();
    const updatedUnidades5 = data5.map(item => ({
      ...item,  // Mantener todos los campos del item original
      ID: item.ID.toString(),  // Asegurarte que ID sea un string
    }));

    setCarrera(updatedUnidades5);  // Guardar el JSON completo en el estado
    //console.log('Carreras cargadas:', updatedUnidades5);  // Mostrar el JSON completo en consola
  } catch (error) {
    //console.error('Error fetching unidades:', error);
  } finally {
    setIsFetching(false);  // Restablecer el estado de carga
  }
};
{/*----------------------------------------------CARRERAS--------------------------------------------- */}

const fetchDataG = async (term) => {
  setLoading(true);
  const maxRetries = 5;
  let attempt = 0;
  let success = false;

  // Preparar filtros
  const unidad = selectedUnidadLabel1 && selectedUnidadLabel1.trim() !== '' ? selectedUnidadLabel1 : 'null';
  const cargo = selectedUnidadLabel2 && selectedUnidadLabel2.trim() !== '' ? selectedUnidadLabel2 : 'null';
  const campus = selectedUnidadLabel4 && selectedUnidadLabel4.trim() !== '' ? selectedUnidadLabel4 : 'null';
  const edificio = selectedUnidadLabel3 && selectedUnidadLabel3.trim() !== '' ? selectedUnidadLabel3 : 'null';

  const url = `https://api-appacademicos.uct.cl/directorio?search=${encodeURIComponent(term)}&unidad=${encodeURIComponent(unidad)}&cargo=${encodeURIComponent(cargo)}&campus=${encodeURIComponent(campus)}&edificio=${encodeURIComponent(edificio)}`;

  try {
    while (attempt < maxRetries && !success) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Error del servidor:", errorData);
          setData([]);
          return;
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          const updatedData = await Promise.all(result.map(async (item) => {
            const FotoUsuario = item.link_foto;
            try {
              const photoResponse = await fetch(FotoUsuario, { method: 'HEAD' });
              if (!photoResponse.ok) {
                item.link_foto = "https://directorio.uct.cl/Fotos/not_found.jpg";
              }
            } catch (err) {
              item.link_foto = "https://directorio.uct.cl/Fotos/not_found.jpg";
            }
            return item;
          }));

          setData(updatedData);
        } else {
          console.warn("Respuesta inesperada:", result);
          setData([]);
        }

        success = true;
      } catch (error) {
        attempt++;
        console.warn(`Intento ${attempt} fallido:`, error);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
        } else {
          console.error("Error fetching academic data después de varios intentos:", error);
          setData([]);
        }
      }
    }
  } finally {
    setLoading(false);
  }
};





//Alumnos
const fetchDataA = async (term) => {
  setLoadingA(true);
  const maxRetries = 5;
  let attempt = 0;
  let success = false;

  // Preparar filtro
  const carreraValue = selectedUnidadLabel5 && selectedUnidadLabel5.trim() !== '' 
    ? selectedUnidadLabel5 
    : 'null';

  const url = `https://api-appacademicos.uct.cl/Adirectorio?search=${encodeURIComponent(term)}&carrera=${encodeURIComponent(carreraValue)}`;

  try {
    while (attempt < maxRetries && !success) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Error del servidor:", errorData);
          setDataA([]);
          return;
        }

        const result = await response.json();
        
        {/* 
        if (Array.isArray(result)) {
          const updatedData = await Promise.all(result.map(async (item) => {
            const FotoUsuario = item.link_foto;
            try {
              const photoResponse = await fetch(FotoUsuario, { method: 'HEAD' });
              if (!photoResponse.ok) {
                item.link_foto = "https://directorio.uct.cl/Fotos/not_found.jpg";
              }
            } catch (err) {
              item.link_foto = "https://directorio.uct.cl/Fotos/not_found.jpg";
            }
            return item;
          }));
        */}
          if (Array.isArray(result)) {
          // Aquí asignamos siempre la foto not_found
          const updatedData = result.map(item => {
            item.link_foto = "https://directorio.uct.cl/Fotos/not_found.jpg";
            return item;
          });

          setDataA(updatedData);
        } else {
          console.warn("Respuesta inesperada:", result);
          setDataA([]);
        }

        success = true;
      } catch (error) {
        attempt++;
        console.warn(`Intento ${attempt} fallido:`, error);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        } else {
          console.error("Error fetching student data después de varios intentos:", error);
          setDataA([]);
        }
      }
    }
  } finally {
    setLoadingA(false);
  }
};






//DEPENDIENDO DE QUE ESCOGE EL USUARIO, UTILIZA UNA DE LOS DOS FETCHDATA, si escoge academicos, data, tendra valores academicos
// si se escoge Alumnos, entonces data, tendra solo alumnos y se refrescara en la flatlist de manera dinamica  
useEffect(() => {
    if (searchTerm) {
      if (selected === 'Académicos') {
        fetchDataG(searchTerm);


        
      } else if (selected === 'Alumnos') {
        fetchDataA(searchTerm);
        
        
      } 
    } else {
      setData([]);
      setDataA([]);
 
    }
  }, [searchTerm, selected]);

  

  // useEffect para la animacion
  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start();
  }, []);

// al escribir en el buscador, renderItem, muestra la foto de la persona y su nombre
// si es academico es FUNC_NOMBRES y si es estudiante NOMBRE_COMPLETO.

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.initialContainer}>
        <Image
          style={styles.imageInitial}
          source={{ uri: item.link_foto && item.link_foto.trim() !== '' ? item.link_foto : usuarioSino }}
        />
      </View>
      <View style={styles.callInfo}>
        <TouchableOpacity onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}>
          <Text style={styles.initialText} allowFontScaling={false}>
            {selected === 'Académicos' ? item.FUNC_NOMBRES : item.NOMBRE_COMPLETO}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Esta funcion selecciona el tipo de usuario que quiero escoger como parametrro
  // si es estudiante o academico, y al momento de pulsar uno, se cierra.
  const handleButtonPress = (type) => {
    setSelected(type);
    setSearchTerm('');
    setSelectedItem(null);
    setIsOpen(!isOpen); 
  };

  //Funcion pora mejorar la busqueda del usuario, quitando minusculas y todo
 // para una mejor obtencion y reconocimiento con la base de datos.
 const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filterData = (data, nameField) => {
  return data.filter(item => {
    if (!item[nameField]) return false;

    const fullName = normalizeString(item[nameField].toLowerCase());
    const searchWords = normalizeString(searchTerm.toLowerCase()).split(' ');

    return searchWords.every(word => fullName.includes(word));
  });
};

// Si se selecciona academicos entonces se toma el valor de data, que contiene academicos
// y si no, dataA, que hace referencia a Alumnos o estudiantes.
const filteredData = selected === 'Académicos'
  ? (Array.isArray(data) ? filterData(data, 'FUNC_NOMBRES') : [])
  : (Array.isArray(dataA) ? filterData(dataA, 'NOMBRE_COMPLETO') : []);
//----------------------------------------------------------

// funcion que no muestra nada, ya que se utiliza cuando no hay datos o
// no se ha buscado nada aun.
  const renderEmptyComponent = () => (
    <View >
    </View>
  );

  // Funcion para limpiar terminos
  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const lineWidth = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], 
  });

  // Esta funcion ayuda a obtener el anexo del academico, y normalizarlo
  // para poder llamar a la funcion linking y que funcione de manera perfecta
  const cleanAnexo = (anexo) => {
    return anexo ? anexo.replace(/[^0-9]/g, '') : '';
  };

  // Funcion para pulsar el item anexo, direccione a contactos del telefono
  const handleCall = () => {
    const phoneNumber = selected === 'Académicos' ? cleanAnexo(selectedItem.ANEXO) : cleanAnexo(selectedItem.ANEXO);
    
    if (phoneNumber) {
      console.log(`Llamando a: ${phoneNumber}`); 
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.log("No hay número de teléfono disponible");
      alert("No hay número de teléfono disponible para esta entrada.");
    }
  };

  // Funcion para pulsar el item email, direccione a gmail del telefono
  const handleEmail = () => {
    const emailAddress = selected === 'Académicos' ? selectedItem.FUNC_EMAIL : selectedItem.EMAIL_INSTITUCIONAL;
    if (emailAddress) {
      Linking.openURL(`mailto:${emailAddress}`);
    }
  };

// estado de visible o oculto de togglemenu
  const toggleMenu = () => {
    setIsOpen(!isOpen); 
  };

  const options = [
    { label: 'Funcionarios', value: 'Académicos' },
    { label: 'Estudiantes', value: 'Alumnos' },
  ];

  const hayFiltrosActivos = () => {
  if (selected === 'Académicos') {
    return (
      selectedUnidadLabel1?.trim() ||
      selectedUnidadLabel2?.trim() ||
      selectedUnidadLabel3?.trim() ||
      selectedUnidadLabel4?.trim()
    );
  } else if (selected === 'Alumnos') {
    return selectedUnidadLabel5?.trim();
  }
  return false;
};

const filtrarUnidad = (text) => {
  setSearchUnidad(text);
  const textoBuscado = quitarTildes(text.toLowerCase());

  setFilteredUnidades(
    unidades.filter(item =>
      quitarTildes(item.DESC_UNIDAD.toLowerCase()).includes(textoBuscado)
    )
  );
};

const filtrarCargo = (text) => {
  setSearchCargo(text);

  const textoBuscado = quitarTildes(text.toLowerCase());

  setFilteredCargos(
    Cargos.filter(item =>
      quitarTildes(item.DESC_CARGO.toLowerCase()).includes(textoBuscado)
    )
  );
};


const filtrarEdificio = (text) => {
  setSearchEdificio(text);
  const textoBuscado = quitarTildes(text.toLowerCase());

  setFilteredEdificios(
    Edificio.filter(item =>
      quitarTildes(item.DESC_EDIFICIO.toLowerCase()).includes(textoBuscado)
    )
  );
};

const filtrarCampus = (text) => {
  setSearchCampus(text);
  const textoBuscado = quitarTildes(text.toLowerCase());

  setFilteredCampus(
    Campus.filter(item =>
      quitarTildes(item.DESC_CAMPUS.toLowerCase()).includes(textoBuscado)
    )
  );
};

const filtrarCarrera = (text) => {
  setSearchCarrera(text);
  const textoBuscado = quitarTildes(text.toLowerCase());

  setFilteredCarreras(
    Carrera.filter(item =>
      quitarTildes(item.NOM_CARRERA.toLowerCase()).includes(textoBuscado)
    )
  );
};


const quitarTildes = (texto) => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};


  // Funcion de retorno de todo el componente en si, tanto el buscador, titulos etc.
  return (
    <ImageBackground source={catolicafondo} style={styles.background222}>
    <Image source={UCTLOGOHD} style={styles.imagenlogohd2}/>
    <View style={styles.container}>
      {/*<Image source={uctImage} style={styles.colorContainer} />*/}
      <View style={styles.containertransparente}>
      <Text style={styles.TituloP} allowFontScaling={false}>DIRECTORIO</Text>
      <View style={styles.contenedor1}>
      <View style={styles.contenedor2}>
        <Image source={LupaDirectorio} style={styles.iconoLupa} />
        {/*El buscador, al momento de escribir alguna letra, el value, cambia
        por lo tanto se utiliza useEffect, y automaticamente al escribir, busca resultados del filtro seleccionado
        ya que a continuacion, se explicara el filtro y ademas, el placeholder cambia
        segun que opcion de filtro haya escogido.
        */}
        <TextInput
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.inputEstilo}
        placeholderTextColor="black"
        allowFontScaling={false}
      />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={clearSearchTerm}>
            <Image source={BorradorT} style={styles.iconoBorrador} />
          </TouchableOpacity>
        )}
      </View>
      {/*Hace visible el filtro entre academicos y alumnos */}
      <TouchableOpacity onPress={toggleMenu} style={{ marginRight: 10 }}>
      <Image source={filtroImage} style={styles.iconoFiltro}  />
      </TouchableOpacity>

    </View>
    
       {listaFinal.length > 0 && (
  <View style={{ marginBottom: 1 }}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      {listaFinal.map((nombre, i) => (
        <View key={i} style={styles.tag2}>
          <Text style={styles.tagText2} allowFontScaling={false}>{nombre}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
)}



    <View style={styles.contenedortodo}>
      
              <Modal
                isVisible={isOpen}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                backdropOpacity={0.6}
                onBackdropPress={() => setIsOpen(false)}
                style={styles.modal32}
                useNativeDriver={true}
        >
          <View style={styles.panel32}>
            <ScrollView contentContainerStyle={styles.scrollContent32}>
              <Text style={styles.title} allowFontScaling={false}>Filtros</Text>
             <View style={styles.separator10} />
            <Text style={styles.label} allowFontScaling={false}>Rol institucional</Text>
            {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => {
            setSelected(option.value);
            SetPlaceholder(`Buscar ${option.label}`);
  
            if (option.value === 'Académicos' || option.value === 'Alumnos') {
                  setListaFinal([]);
                  setSeleccionados([]);
                }
              }}
            >
          <View style={styles.radioCircle}>
            {selected === option.value && <View style={styles.selectedRb10} />}
          </View>
          <Text style={styles.optionLabel10} allowFontScaling={false}>{option.label}</Text>
        </TouchableOpacity>
      ))}

{/*------------------------------------UNIDAD--------------------------------------------*/}
         {/* Unidad - solo si se selecciona "Académicos" */}
      {selected === 'Académicos' && (
        <>
          <Text style={styles.label} allowFontScaling={false}>Unidad</Text>
          <TouchableOpacity
            onPress={() => setShowUnidadModal1(true)} // <-- tu modal personalizado
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              color: selectedUnidad ? '#000000' : '#999999',
              fontFamily: 'Montserrat-Regular',
            }} allowFontScaling={false}>
              {selectedUnidadLabel1 || 'Seleccione una unidad'}
            </Text>
</TouchableOpacity>
        </>
      )}
      <Modal
  isVisible={showUnidadModal1}
  onBackdropPress={() => setShowUnidadModal1(false)}
  style={{ margin: 0 }} // Ocupa toda la pantalla
  animationIn="slideInUp"
  animationOut="slideOutDown"
>
  <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 20 }}>
    {/* Encabezado */}
    <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee', marginTop: Platform.OS === 'ios' ? 50 : 30, }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }} allowFontScaling={false}>Selecciona una unidad</Text>
    </View>

    {/* Lista scrollable */}

    <TextInput
  placeholder="Buscar unidad"
  placeholderTextColor="black"  // Aquí defines el color que quieras
  value={searchUnidad}
  onChangeText={filtrarUnidad}
  style={{
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  }}
/>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
  {filteredUnidades.map((item) => (
    <TouchableOpacity
      key={item.ID}
      onPress={() => {
        setselectedUnidad(item.ID.toString());
        setselectedUnidadLabel1(item.DESC_UNIDAD);
        setShowUnidadModal1(false);
        setSeleccionados(prev => ({ ...prev, unidad: item.DESC_UNIDAD }));
      }}
      style={{
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
      }}
    >
      <Text style={{ fontSize: 16 }} allowFontScaling={false}>{item.DESC_UNIDAD}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

    {/* Botón de cancelar */}
    <TouchableOpacity
      onPress={() => setShowUnidadModal1(false)}
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16, color: '#007AFF' }} allowFontScaling={false}>Cancelar</Text>
    </TouchableOpacity>
  </View>
</Modal>
{/*------------------------------------UNIDAD--------------------------------------------*/}


{/*------------------------------------CARGO--------------------------------------------*/}
      {/* Cargo - solo si se selecciona "Académicos" */}
      {selected === 'Académicos' && (
        <>
          <Text style={styles.label} allowFontScaling={false}>Cargo</Text>
          <TouchableOpacity
            onPress={() => setShowUnidadModal2(true)} // <-- tu modal personalizado
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              color: selectedCargo ? '#000000' : '#999999',
              fontFamily: 'Montserrat-Regular',
            }} allowFontScaling={false}>
              {selectedUnidadLabel2 || 'Seleccione un cargo'}
            </Text>
</TouchableOpacity>
        </>
      )}
      <Modal
  isVisible={showUnidadModal2}
  onBackdropPress={() => setShowUnidadModal2(false)}
  style={{ margin: 0 }}
  animationIn="slideInUp"
  animationOut="slideOutDown"
>
  <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 20 }}>
    {/* Encabezado */}
    <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee', marginTop: Platform.OS === 'ios' ? 50 : 30,  }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }} allowFontScaling={false}>Selecciona un Cargo</Text>
    </View>


{/* Lista scrollable */}

    <TextInput
  placeholder="Buscar cargo"
  placeholderTextColor="black"  // Aquí defines el color que quieras
  value={searchCargo}
  onChangeText={filtrarCargo}
  style={{
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  }}
/>
    {/* FlatList para scroll infinito */}
    <FlatList
      data={filteredCargos}
      keyExtractor={(item) => item.ID.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            setselectedCargo(item.ID.toString());
            setselectedUnidadLabel2(item.DESC_CARGO);
            setShowUnidadModal2(false);
            setSeleccionados(prev => ({ ...prev, cargo: item.DESC_CARGO }));
          }}
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderColor: '#eee',
          }}
        >
          <Text style={{ fontSize: 16 }} allowFontScaling={false}>{item.DESC_CARGO}</Text>
        </TouchableOpacity>
      )}
     
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetching ? (
        <Text style={{ textAlign: 'center', padding: 10 }} allowFontScaling={false}>Cargando más...</Text>
      ) : null}
    />

    {/* Botón de cancelar */}
    <TouchableOpacity
      onPress={() => setShowUnidadModal2(false)}
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16, color: '#007AFF' }} allowFontScaling={false}>Cancelar</Text>
    </TouchableOpacity>
  </View>
</Modal>

{/*------------------------------------CARGO--------------------------------------------*/}      

{/*------------------------------------EDIFICIO--------------------------------------------*/} 
      {/* Edificio - solo si se selecciona "Académicos" */}
      {selected === 'Académicos' && (
        <>
          <Text style={styles.label} allowFontScaling={false}>Edificio</Text>
          <TouchableOpacity
            onPress={() => setShowUnidadModal3(true)} // <-- tu modal personalizado
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              color: selectedEdificio ? '#000000' : '#999999',
              fontFamily: 'Montserrat-Regular',
            }} allowFontScaling={false}>
              {selectedUnidadLabel3 || 'Seleccione un edificio'}
            </Text>
</TouchableOpacity>
        </>
      )}
      <Modal
  isVisible={showUnidadModal3}
  onBackdropPress={() => setShowUnidadModal3(false)}
  style={{ margin: 0 }} // Ocupa toda la pantalla
  animationIn="slideInUp"
  animationOut="slideOutDown"
>
  <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 20 }}>
    {/* Encabezado */}
    <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee', marginTop: Platform.OS === 'ios' ? 50 : 30,  }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }} allowFontScaling={false}>Selecciona un edificio</Text>
    </View>

    {/* Lista scrollable */}

    <TextInput
  placeholder="Buscar edificio"
  placeholderTextColor="black"  // Aquí defines el color que quieras
  value={searchEdificio}
  onChangeText={filtrarEdificio}
  style={{
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  }}
/>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {filteredEdificios.map((item) => (
        <TouchableOpacity
          key={item.ID}
          onPress={() => {
            setselectedEdificio(item.ID.toString());
            setselectedUnidadLabel3(item.DESC_EDIFICIO);
            setShowUnidadModal3(false);
            setSeleccionados(prev => ({ ...prev, edificio: item.DESC_EDIFICIO }));
          }}
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderColor: '#eee',
          }}
        >
          <Text style={{ fontSize: 16 }} allowFontScaling={false}>{item.DESC_EDIFICIO}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* Botón de cancelar */}
    <TouchableOpacity
      onPress={() => setShowUnidadModal3(false)}
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16, color: '#007AFF' }} allowFontScaling={false}>Cancelar</Text>
    </TouchableOpacity>
  </View>
</Modal>
{/*------------------------------------EDIFICIO--------------------------------------------*/} 


{/*------------------------------------CAMPUS--------------------------------------------*/} 
      {/* Campus - solo si se selecciona "Académicos" */}
      {selected === 'Académicos' && (
        <>
          <Text style={styles.label} allowFontScaling={false}>Campus</Text>
          <TouchableOpacity
            onPress={() => setShowUnidadModal4(true)} // <-- tu modal personalizado
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              color: selectedCampus ? '#000000' : '#999999',
              fontFamily: 'Montserrat-Regular',
            }} allowFontScaling={false}>
              {selectedUnidadLabel4 || 'Seleccione un campus'}
            </Text>
</TouchableOpacity>
        </>
      )}
      <Modal
  isVisible={showUnidadModal4}
  onBackdropPress={() => setShowUnidadModal4(false)}
  style={{ margin: 0 }} // Ocupa toda la pantalla
  animationIn="slideInUp"
  animationOut="slideOutDown"
>
  <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 20 }}>
    {/* Encabezado */}
    <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee', marginTop: Platform.OS === 'ios' ? 50 : 30,  }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }} allowFontScaling={false}>Selecciona un campus</Text>
    </View>

    {/* Lista scrollable */}

     <TextInput
  placeholder="Buscar campus"
  placeholderTextColor="black"  // Aquí defines el color que quieras
  value={searchCampus}
  onChangeText={filtrarCampus}
  style={{
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  }}
/>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {filteredCampus.map((item) => (
        <TouchableOpacity
          key={item.ID}
          onPress={() => {
            setselectedCampus(item.ID.toString());
            setselectedUnidadLabel4(item.DESC_CAMPUS);
            setShowUnidadModal4(false);
            setSeleccionados(prev => ({ ...prev, campus: item.DESC_CAMPUS }));
          }}
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderColor: '#eee',
          }}
        >
          <Text style={{ fontSize: 16 }} allowFontScaling={false}>{item.DESC_CAMPUS}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* Botón de cancelar */}
    <TouchableOpacity
      onPress={() => setShowUnidadModal4(false)}
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16, color: '#007AFF' }} allowFontScaling={false}>Cancelar</Text>
    </TouchableOpacity>
  </View>
</Modal>
{/*------------------------------------CAMPUS--------------------------------------------*/} 

{/*------------------------------------CARRERA--------------------------------------------*/} 
      {/* Carrera - solo si se selecciona "Alumnos" */}
      
      {selected === 'Alumnos' && (
        <>
          <Text style={styles.label} allowFontScaling={false}>Carrera</Text>
          <TouchableOpacity
            onPress={() => setShowUnidadModal5(true)} // <-- tu modal personalizado
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 15,
              justifyContent: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              color: selectedCarrera ? '#000000' : '#999999',
              fontFamily: 'Montserrat-Regular',
            }} allowFontScaling={false}>
              {selectedUnidadLabel5 || 'Seleccione un carrera'}
            </Text>
</TouchableOpacity>
        </>
      )}
      <Modal
  isVisible={showUnidadModal5}
  onBackdropPress={() => setShowUnidadModal5(false)}
  style={{ margin: 0 }} // Ocupa toda la pantalla
  animationIn="slideInUp"
  animationOut="slideOutDown"
>
  <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 20 }}>
    {/* Encabezado */}
    <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee', marginTop: Platform.OS === 'ios' ? 50 : 30,  }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }} allowFontScaling={false}>Selecciona una carrera</Text>
    </View>


 <TextInput
  placeholder="Buscar carrera"
  placeholderTextColor="black"  // Aquí defines el color que quieras
  value={searchCarrera}
  onChangeText={filtrarCarrera}
  style={{
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  }}
/>
    {/* Lista scrollable */}
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {filteredCarreras.map((item) => (
        <TouchableOpacity
          key={item.ID}
          onPress={() => {
            setselectedCarrera(item.ID.toString());
            setselectedUnidadLabel5(item.NOM_CARRERA);
            setShowUnidadModal5(false);
            setSeleccionados(prev => ({ ...prev, carrera: item.NOM_CARRERA }));
          }}
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderColor: '#eee',
          }}
        >
          <Text style={{ fontSize: 16 }} allowFontScaling={false}>{item.NOM_CARRERA}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* Botón de cancelar */}
    <TouchableOpacity
      onPress={() => setShowUnidadModal5(false)}
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16, color: '#007AFF' }} allowFontScaling={false}>Cancelar</Text>
    </TouchableOpacity>
  </View>
</Modal>
{/*------------------------------------CARRERA--------------------------------------------*/} 

          
      {/*---------------------------------------------------------------------------------------- */}
            </ScrollView>
            <View style={styles.separator10} />
            <View style={styles.buttonRow32}>
              <TouchableOpacity onPress={resetFilters} style={styles.resetButton32}>
                <Text style={styles.resetText32} allowFontScaling={false}>Limpiar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                style={[
                  styles.applyButton32,
                  !hayFiltrosActivos() && { backgroundColor: '#ccc' } // gris si deshabilitado
                ]}
                disabled={!hayFiltrosActivos()}
              >
                <Text
                  style={[
                    styles.applyText32,
                    !hayFiltrosActivos() && { color: '#888' } // texto más claro si deshabilitado
                  ]}
                  allowFontScaling={false}
                >
                  Mostrar
                </Text>
              </TouchableOpacity>

            </View>
            <View style={styles.separator10} />
            
          </View>
          
        </Modal>
      
    </View>
    

{/*Esta flatlist muestra los datos de academico */}
    <FlatList
  data={selected === 'Académicos' ? filteredData : dataA}
  renderItem={renderItem}
  keyExtractor={(item, index) => index.toString()}
  ListEmptyComponent={loading || loadingA ? <ActivityIndicator size="large" color="#0000ff" /> : renderEmptyComponent()}
  style={{ width: '100%'}} 
  contentContainerStyle={{ paddingBottom: 100}}
/>

{/*De los academicos o estudiantes cargados al momento de buscar, si se pulsa uno
en el renderItem, hay un touchableopacity, el cual pulsa el item, y hace visible el modal
pero con los datos de la persona seleccionada

*/}
      {selectedItem && (
  <Modal
    isVisible={modalVisible}
    onRequestClose={() => {
      setModalVisible(false);
      setSelectedItem(null);
    }}
    style={styles.modal}
  >
    <ImageBackground source={catolicafondo} style={styles.modalFullScreen}>
      <Image source={UCTLOGOHD} style={styles.imagenlogohd}/>
      <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
        <View style={styles.iconContainer2}>
          <Image source={flecha_blanca} style={styles.closeIcon} />
        </View>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image style={styles.circularImage} source={{ uri: selectedItem.link_foto }} />
      </View>
      {/*Aca se muestra el nombre de la persona, si se selecciona academicos es FUNC_NOMBRES,
      si es estudiante, es NOMBRE_COMPLETO, y lo mismo para su area.
      */}
      <Text style={styles.modalTitle} allowFontScaling={false}>
        {selected === 'Académicos' ? selectedItem.FUNC_NOMBRES : selectedItem.NOMBRE_COMPLETO}
      </Text>
      <Text style={styles.modalTitle2} allowFontScaling={false}>
        {selected === 'Académicos' ? selectedItem.DESC_UNIDAD : selectedItem.NOM_CARRERA}
      </Text>
      <View style={styles.container6}>
        <View style={styles.buttonContainerModal}>
          {selected === 'Académicos' && (
            <>
              <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
                <View style={styles.iconContainer}>
                  <Image source={telefonochico} style={styles.buttonIcon} />
                </View>
                <Text style={styles.iconText} allowFontScaling={false}>Llamar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => PruebaVariable(selectedItem.Sigla_Edif)}>
                <View style={styles.iconContainer}>
                  <Image source={edificio} style={styles.buttonIcon} />
                </View>
                <Text style={styles.iconText} allowFontScaling={false}>Ubicación</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.iconButton} onPress={handleEmail}>
            <View style={styles.iconContainer}>
              <Image source={correeochico} style={styles.buttonIcon} />
            </View>
            <Text style={styles.iconText} allowFontScaling={false}>Correo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainerModal}>
          <View style={styles.infoText}>      
            <Image source={correeochico} style={styles.imageLogoModal}/>
            <Text style={styles.blueText} allowFontScaling={false}>
            {`${selected === 'Académicos' ? selectedItem.FUNC_EMAIL?.trim() : selectedItem.EMAIL_INSTITUCIONAL}`}
            </Text>
          </View>  

          {/*Se muestran estos datos solo si selected es Academicos, sino no muestra nada de esto
          que son los datos personales como edificio, fecha de cumpleaños, etc.
          */}
          {selected === 'Académicos' && (
            <> 
            <View style={styles.infoText}>
            <Image source={telefonochico} style={styles.imageLogoModal}/>
            <Text style={styles.blueText} allowFontScaling={false}>
              {selectedItem.ANEXO}
            </Text>
          </View>           
             <View style={styles.infoText}>
              <Image source={cargo} style={styles.imageLogoModal}/>
              <Text style={styles.blueText} allowFontScaling={false}>
                {selectedItem.DESC_CARGO}
              </Text>
            </View>   
             <View style={styles.infoText}>
              <Image source={edificio} style={styles.imageLogoModal}/>
              <Text style={styles.blueText} allowFontScaling={false}>
                {selectedItem.DESC_EDIFICIO}
              </Text>
            </View>  
            <View style={styles.infoText}>
              <Image source={pastel} style={styles.imageLogoModal}/>
              <Text style={styles.blueText} allowFontScaling={false}>
              {/*En este apartado se llama a la funcion probar, que contiene su cumpleaños ordenado */}
              {probar(selectedItem.FUNC_FECHA_NAC)}
              </Text>
            </View>          
             <View style={styles.infoText}>
              <Image source={mapaLogo} style={styles.imageLogoModal}/>
      
              <Text style={styles.blueText} allowFontScaling={false}>
                {selectedItem.DESC_CAMPUS}
              </Text>
            </View>
            </>
            //------------------------------------------------------------ 
          )}
        </View>
      </View>
    </ImageBackground>
    
  </Modal>
)}
</View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  container2: {
    marginTop: 60,
    backgroundColor: 'red',
  },
  
  ImagenBorrador: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  ImagenBorrador2: {
    width: 20,
    height: 20,
    marginLeft: 15,
  },
  
  circularImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 15,
    marginTop: 40,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  imageBuscador: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  imageInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
  },
  buttonContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    width: 160,
    height: 100,
    alignSelf: 'center',
    borderRadius: 15,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    // Sombra para Android
    elevation: 5,
  },
  Contactos: {
    color: 'black',
    fontSize: 30,
    paddingVertical: 5,
    top: -70,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#40b9e5',
  },
 
  ImagenBorrador3: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    right: -30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7a7a7',
    borderRadius: 30,
    alignSelf: 'center',
    width: '80%',
    height: '30%',
    marginTop: -40,
    marginRight: 30,
  },
  inputContainerDirectorio: {

  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  
  },
  clearButton: {
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  initialContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initialText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  callInfo: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
  },
  modalFullScreen: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',

    
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Ultra',
        fontWeight: 'bold',
        
  },
  modalTitle2:{
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Ultra',
        fontWeight: 'bold',
  },
  infoText: {
    fontSize: 18,
    flexDirection: 'row',
    alignItems: 'center',
    color: '#3491f5',
    //justifyContent: 'space-between', // Alinea el texto de título y valor a los extremos
    width: '100%',
    fontFamily: 'Montserrat-Regular',
    backgroundColor: 'red',  // Fondo blanco con 80% de opacidad
    
    paddingRight: 10,
    marginTop: 10,
    backgroundColor: 'transparent',  // Fondo transparente
    paddingLeft: 5,
  },
  blueText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#515151',
    paddingLeft: 30, // Espacio a la izquierda para separar de "Edificio"
    paddingTop: 4
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30, // Ajusta solo para iOS (iPhone)
    left: 20,
    zIndex: 1,
  },
  closeIcon: {
    width: 35,
    height: 25,
  },
  colorContainer: {
    alignItems: 'center',
    height: 170,
    width: '100%',

  },
  container6: {
    borderColor: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    minHeight: 1000,
    overflow: 'hidden',
    marginTop: 20,
    width: '100%',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonContainerModal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 100,
  },
  imagenlogohd: {
    width: 180,           // Ancho de la imagen
    height: 60,           // Alto de la imagen
    top: Platform.OS === 'ios' ? 50 : 20,
    left: '50%',          // Centra la imagen horizontalmente en la pantalla
    transform: [{ translateX: -90 }], // Corrige la posición de la imagen, para centrarla completamente
  },
  imagenlogohd2: {
   width: 170,           // Ancho de la imagen
    height: 120,           // Alto de la imagen
    resizeMode: 'contain',  // Ajusta la imagen para que se vea completa sin recortarse
    top: 20,              // Mueve la imagen 50 unidades hacia abajo
    left: '50%',          // Centra la imagen horizontalmente en la pantalla
    transform: [{ translateX: -90 }], // Corrige la posición de la imagen, para centrarla completamente
  },
  
  buttonContainerContac: {
    alignItems: 'left',
    backgroundColor: 'white',
    height: '10%',
  },
  iconButton: {
    alignItems: 'center',
  },
  buttonIcon: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  iconText: {
    textAlign: 'center', 
    fontFamily: 'Montserrat-Regular',
    color: '#515151',
    padding: 5,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#d3d3d3',
  },
  contactTitle: {
    fontSize: 25,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
  contactTitleContainer: {
    alignItems: 'center',
  },
  underline: {
    height: 3,
    backgroundColor: '#3491f5',
    marginTop: 5,
  },
  infoContainerModal: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    maxHeight: '50%',
    
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#d9f8fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer2: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#32abe1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#3491f5',
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    padding: 5,
  },
  imageLogoModal: {
    width: 25,
    height: 25,
  },

  searchIcon: {
    width: 20, // Ajusta el tamaño según sea necesario
    height: 20,
    marginLeft: 15, // Espacio entre la imagen y el TextInput
    marginRight: 10, // Espacio entre la imagen y el TextInput
  },
  rightIcon: {
    width: 20, // Ajusta el tamaño según sea necesario
    height: 20,
    marginLeft: 350, // Espacio entre el TextInput y la imagen de la derecha
    marginTop: -205,
  },
TituloP: {
    color: '#0178bc',
    fontSize: 24,
    top: 0,
    textAlign: 'center',
    fontFamily: 'Ultra',
    fontWeight: 'bold',
    marginTop: 20,
  },

  contenedor1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%', // Ajusta el ancho según sea necesario
    alignSelf: 'center', // Centra el contenedor en el eje horizontal
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    // Sombra para Android
    elevation: 1,
  },
  contenedor2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 30,
    flex: 1,
    paddingHorizontal: 10,
    zIndex: 1,
    marginLeft: 10,
  },
  containertransparente: {
        borderColor: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        flex: 1,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        minHeight: 580,
        overflow: 'hidden',
        marginTop: 20,
        width: '100%',
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 1,
        paddingTop: 0,
        marginTop: 30,
        top: Platform.OS === 'ios' ? -20 : -30,
    },
  inputEstilo: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: 'black',
  },
  iconoLupa: {
    width: 24,
    height: 24,
  },
  iconoBorrador: {
    width: 24,
    height: 24,
  },
  iconoFiltro: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  contenedortodo: {
  marginLeft: 220,
  padding: 10,
 
},


//otros

modalOverlay: {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Fondo oscuro con transparencia
  justifyContent: 'center',  // Centra el contenido verticalmente
  alignItems: 'center',      // Centra el contenido horizontalmente
  width: '100%',            // Asegura que ocupe todo el ancho de la pantalla
  height: '100%',           // Asegura que ocupe toda la altura de la pantalla
  alignSelf: 'center',   // Centra el modal horizontalmente en la pantalla
  
},

  modalContent: {
  backgroundColor: '#fff',
  width: '90%',          // Ajuste para el tamaño del modal
  height: '65%',
  borderRadius: 10,
  padding: 20,
  elevation: 5,

  
},

  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  label: {
    fontWeight: '300',
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    marginBottom: 20,
    paddingTop: 20,
    fontSize: 18,
    
  },
  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
   

  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 0.5,
    
    
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#40b9e5',
    borderRadius: 15,
    width: '65%',
    
  },
  resetText: {
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Montserrat-Regular',
    allowFontScaling: false, 
    textAlign: 'center',
    fontSize: 14,

  },
  applyText: {
    color: '#fff',
    fontWeight: '800',
    fontFamily: 'Montserrat-Regular',
    allowFontScaling: false, 
    textAlign: 'center',
    fontSize: 14,
  },

optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a3d7c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
selectedRb10: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1a3d7c',
  },
  optionLabel10: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#000',
  },
  filtersContainer: {
  flexGrow: 1,
  justifyContent: 'flex-start',
},
separator10: {
  height: 0.3,
  
  backgroundColor: '#000', // Negro
  marginVertical: 10,      // Espaciado arriba y abajo (ajustable)
},







// PRUEBAS

modal32: {
    margin: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  panel32: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  scrollContent32: {
    paddingBottom: 100, // para no tapar con los botones
  },
  buttonRow32: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  resetButton32: {
    
    padding: 10,
    borderRadius: 8,
    
  },
  resetText32: {
    color: '#000',
    
  },
  applyButton32: {
    backgroundColor: '#007AFF',
    padding: 10,
    width: '50%',
    borderRadius: 8,
    
  },
  applyText32: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    
  },

  //Pruebas

  scrollContainer: {
    marginTop: 10,
    maxHeight: 30,
    paddingLeft: 10,
  }, 

   tagText2: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },

  tag2: {
    backgroundColor: '#40b9e5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
   
  },
  background222: {
        flex: 1,
        resizeMode: 'relative',
    },
    
});

export default FormularioDirectorio;