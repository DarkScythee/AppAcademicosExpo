import React, { Component } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ManeTokens from '../ManejoTokens';

//Imagenes
const uctImage = require('../../imagenes/back.jpg');
const FlechaA = require('../../imagenes/flecha_abajo.png');
const FlechaB = require('../../imagenes/flecha_arriba.png');


export class CargaAcademica extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      cardsData: [],
      expandedItems: {},
      semesterData: {},
      salasData: {},
      isModalVisible: false,
      selectedSalasData: [],
      isInfoModalVisible: false, // Estado para el modal de información
      selectedInfoData: null, // Datos de la asignatura seleccionada
    };
  }

  async componentDidMount() {
    await this.CargaAcademicaA();
  }

  // Funcion para obtener los datos de las salas de cada asignatura, tiene como parametro item, que hace referencia
  // a la asignatura, la cual contiene, Sigla, Año, semestre y seccion, las cuales se envian por un cuerpo a la API
  // y devuelve toda la informacion en un json y lo muestra en un modal.
  async fetchSalasData(item) {
    const { Sigla, Anho, Semestre, Seccion } = item;
    const { token } = this.props; 
    const requestBody = {
      Sigla: Sigla,
      Anho: parseInt(Anho, 10),
      Semestre: parseInt(Semestre, 10),
      Seccion: parseInt(Seccion, 10),
    };
    //Llamada a la funcion cargaacademicasalas, la cual al pasar un body con sigla
    // año, semestre y seccion, responde con la informacion de esa asignatura
    // la cual se guarda en un jsonData.
    try {
      const response = await fetch('https://api-appacademicos.uct.cl/CargaAcademicaSalas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const jsonData = await response.json();
        this.setState(prevState => ({
          salasData: {
            ...prevState.salasData,
            [Sigla]: jsonData,
          },
        }), () => {
          this.openModal(jsonData);
        });
      } else {
        console.error('Error al obtener datos de Salas:', response.status);
      }
    } catch (error) {
      console.error('Error de red al obtener Salas:', error);
    }
  }

  //Funcion para obtener las carreras y asignatura del academico, ademas de mas informacion
  // y eso pasando como parametro el rut de la persona la cual la guardo al momento
  // de que inicie sesion y la obtengo gracias a manejodatos.js
  async CargaAcademicaA() {
    const { token } = this.props; 
    const { user } = this.props; 
    const rut = user.Rut;   
    try {
      const response = await fetch(`https://api-appacademicos.uct.cl/CargaAcademica?search=${rut}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const jsonData = await response.json();

        //En este apartado se toman todos los datos necesarios a mostrar al academico
        const tableData = jsonData.map(item => ({
          Carrera: item.Carrera,
          Semestre: item.Semestre,
          Asignatura: item.Asignatura,
          Sigla: item.Sigla, // Info
          CantidadAlumnos: item.CantidadA, // Info
          Cupos: item.Cupos, // Info
          HorasMix: item.Horas_mixtas, // Info
          HorasPre: item.Horas_presenciales, // Info
          Anho: item.Anho, // Info
          Grupo: item.Grupo, // Info
          Seccion: item.Seccion,
        }));
      // En este apartado se crea un arreglo con la propiedad carrera, en la cual tendra objetos como id, title, asignaturas
      // y color en cardsdata, por lo que cada 
        const uniqueCarreras = Array.from(new Set(tableData.map(item => item.Carrera)));
        const cardsData = uniqueCarreras.map((carrera, index) => ({
          id: index.toString(),
          title: carrera,
          asignaturas: tableData.filter(item => item.Carrera === carrera).length,
          color: this.getRandomColor(),
        }));

        this.setState({ tableData, cardsData });
      } else {
        console.error('Error en la respuesta:', response.status);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  
// Esta función maneja la acción de presionar una carrera, con distintos estados como semestre 1 y semestre 2
  handleCareerPress = (item) => {
    const { tableData } = this.state;
    const filteredData = tableData.filter(data => data.Carrera === item.title);
    const semester1 = filteredData.filter(data => data.Semestre === "1");
    const semester2 = filteredData.filter(data => data.Semestre === "2");

    this.setState(prevState => ({
      expandedItems: {
        ...prevState.expandedItems,
        [item.id]: !prevState.expandedItems[item.id],
      },
      semesterData: {
        ...prevState.semesterData,
        [item.id]: { semester1, semester2 },
      },
    }));
  };

  // El modal se hace visible, y como parametro, tiene los datos de un json el cua lse deja como estado a mostrar
  openModal = (salasData) => {
    this.setState({
      isModalVisible: true,
      selectedSalasData: salasData,
    });
  };

  //Al llamar a esta funcion el estado del modal, se hace false y se cierra, ademas, se vacia el arreglo de selectedsalasdata
  closeModal = () => {
    this.setState({ isModalVisible: false, selectedSalasData: [] });
  };

    // El modal se hace visible, y como parametro, tiene los datos de la asignatura a mostrarr
  openInfoModal = (infoData) => {
    this.setState({
      isInfoModalVisible: true,
      selectedInfoData: infoData,
    });
  };
// cierra el modal de informacio de openinfomodal
  closeInfoModal = () => {
    this.setState({ isInfoModalVisible: false, selectedInfoData: null });
  };

  render() {
    const { cardsData, tableData, expandedItems, semesterData, salasData, isModalVisible, selectedSalasData, isInfoModalVisible, selectedInfoData } = this.state;
    
    // Calcular totales de asignaturas y de carreras
    const totalAsignaturas = tableData.length;
    const totalCarreras = Array.from(new Set(tableData.map(item => item.Carrera))).length;

    return (
      <View style={styles.container}>
        <Image
          source={uctImage}
          style={styles.colorContainer}
        />
          <Text style={styles.TituloP} allowFontScaling={false}>
            Carga Academica
          </Text>
          {/*En este apartado se muestra una tarjeta pequeña que muestra el total de asignaturas y el total de carreras
          que tiene el academico.
          */}
        <View style={styles.totalesContainer}>
          <View style={styles.totalBox}>
            <Text style={styles.totalNumber} allowFontScaling={false}>{totalAsignaturas}</Text>
            <Text style={styles.totalLabel} allowFontScaling={false}>Asignaturas</Text>
          </View>
          <View style={styles.totalBox}>
            <Text style={styles.totalNumber} allowFontScaling={false}>{totalCarreras}</Text>
            <Text style={styles.totalLabel} allowFontScaling={false}>Carreras</Text>
          </View>
        </View>
        
        <View style={styles.tableContainer}>
          <FlatList
            data={cardsData}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.cardList}
            contentContainerStyle={{ paddingBottom: 250 }} // Añadir espacio en la parte inferior
          />
        </View>
         

         {/*Modal en el cual se muestra toda la informacion propia de la asignatura pertenecientes a su horrario.
         como la seccion, dia, horario, y sus salas asignadas.
       */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle} allowFontScaling={false}>Horario</Text>
              <FlatList
                data={selectedSalasData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.listItemContainer}>
                    <View style={styles.sectionContainer}>
                      <Text style={styles.listText} allowFontScaling={false}>Sección:</Text>
                      <Text style={[styles.listText, styles.customText, { marginLeft: 0 }]} allowFontScaling={false}>{item.Seccion}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.sectionContainer}>
                      <Text style={styles.listText} allowFontScaling={false}>Día:</Text>
                      <Text style={[styles.listText, styles.customText, { marginLeft: 0 }]} allowFontScaling={false}>{item.Dia}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.sectionContainer}>
                      <Text style={styles.listText} allowFontScaling={false}>Horario:</Text>
                      <Text style={[styles.listText, styles.customText, { marginLeft: 0 }]} allowFontScaling={false}>{item.Horario}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.sectionContainer}>
                      <Text style={styles.listText} allowFontScaling={false}>Salas:</Text>
                      <Text style={[styles.listText, styles.customText, { marginLeft: 0 }]} allowFontScaling={false}>{item.Salas}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.sectionContainer}>
                      <Text style={styles.listText} allowFontScaling={false}>Campus:</Text>
                      <Text style={[styles.listText, styles.customText, { marginLeft: 0 }]} allowFontScaling={false}>{item.Campus}</Text>
                    </View>
                    <View style={styles.separator} />
                  </View>
                )}
              />
              <Pressable style={styles.closeButton} onPress={this.closeModal}>
                <Text style={styles.closeButtonText} allowFontScaling={false}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

       {/*Modal en el cual se muestra toda la informacion propia de la asignatura como tal, en data, estan
       todos los datos a mostrar, ya que se rellenan segun el item, y se muestran
       */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isInfoModalVisible}
          onRequestClose={this.closeInfoModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedInfoData && (
                <>
                  <Text style={styles.modalTitle} allowFontScaling={false}>Información</Text>
                  <FlatList
                    data={[
                      { label: 'Asignatura', value: selectedInfoData.Asignatura },
                      { label: 'Cantidad de Alumnos', value: selectedInfoData.CantidadAlumnos },
                      { label: 'Cupos', value: selectedInfoData.Cupos },
                      { label: 'Horas Mixtas', value: selectedInfoData.HorasMix },
                      { label: 'Horas Presenciales', value: selectedInfoData.HorasPre },
                      { label: 'Año', value: selectedInfoData.Anho },
                      { label: 'Grupo', value: selectedInfoData.Grupo },
                      { label: 'Sección', value: selectedInfoData.Seccion },
                      { label: 'Sigla', value: selectedInfoData.Sigla },
                    ]}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                      <View style={styles.listItemContainer}>
                        <View style={styles.sectionContainer}>
                          <Text style={styles.listText} allowFontScaling={false}>{item.label}:</Text>
                          <Text style={[styles.listText, styles.customText, { marginLeft: 3 }]} allowFontScaling={false}>{item.value}</Text>
                        </View>
                        <View style={styles.separator} />
                      </View>
                    )}
                  />
                </>
              )}
              <Pressable style={styles.closeButton} onPress={this.closeInfoModal}>
                <Text style={styles.closeButtonText} allowFontScaling={false}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

// Este renderItem, se encarga de mostrar los datos de la carrera y su asignatura
// ademas al pulsar, llama a la funcion para filtrar los datos por ID, y de esa manera
// cambiar el estado de expandedItems segun su ID la cual muestra el semestre 1 y semestre 2
// OJO: se hace un ciclo if el cual si no encuentra NADA o el lenght no es mayor a 0, no muestra nada
// ya que no existe asignatura de semestre 1 o 2.

  renderItem = ({ item }) => {
    const { expandedItems, semesterData } = this.state;
    const arrowImage = expandedItems[item.id] ? FlechaB : FlechaA;
    return (
      // En este apartado se muestra una tarjeta, donde esta el titulo de la carrera y sus asignaturas.
      <View>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => this.handleCareerPress(item)}>
          <View style={[styles.colorSquare, { backgroundColor: item.color }]}>
          </View>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardText} allowFontScaling={false}>{item.title}</Text>
              <Text style={styles.asignaturasText} allowFontScaling={false}>{item.asignaturas} Asignaturas</Text>
            </View>
            <Image source={arrowImage} style={styles.arrowImage} />
          </View>
        </TouchableOpacity>

        {/*Logica para el semestre numero 1, en este apartado se renderiza información sobre 
               las asignaturas del Semestre 1 de una carrera específica, 
               mostrándola solo si hay asignaturas para ese semestre*/}
        {expandedItems[item.id] && semesterData[item.id] && (
          <View style={styles.semesterContainer}>
            {semesterData[item.id].semester1.length > 0 && (
              <View style={styles.semesterContent}>
                <View style={[styles.colorSquare, { backgroundColor: item.color, width: 40, height: 7, borderRadius: 5, marginRight: 10 }]} />
                <Text style={styles.semesterTitle} allowFontScaling={false}>Semestre 1</Text>
                {semesterData[item.id].semester1.map((asignatura, index) => (
                  <View key={`${asignatura.Sigla}-${index}`} style={styles.assignmentContainer}>
                    <View style={styles.assignmentRow}>
                      <Text style={styles.tableCellAsignatura} allowFontScaling={false}>{asignatura.Asignatura}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                      <Text style={styles.sectionLabel} allowFontScaling={false}>Sección:</Text>
                      <Text style={styles.tableCellSeccion} allowFontScaling={false}>{asignatura.Seccion}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                      <Text style={styles.sectionLabel} allowFontScaling={false}>Sigla:</Text>
                      <Text style={styles.tableCellSeccion} allowFontScaling={false}>{asignatura.Sigla}</Text>
                    </View>
                    {/*Si se presiona este boton, se llama a la funcion fetchsalasData 
                    la cual abre un modal, con los datos de esa asignatura en particular, ya que se pasa como parametro
                    la asignatura, y se envia un cuerpo el cual tiene todas sus propiedades internas.
                    */}
                    <TouchableOpacity style={styles.button} onPress={() => this.fetchSalasData(asignatura)}>
                      <Text style={styles.buttonText} allowFontScaling={false}>Horario</Text>
                    </TouchableOpacity>
                    {/*Si se presiona este boton, se llama a la funcion openInfoModal 
                    la cual abre un modal, con la informacion mostrada en una flatlist de esa asignatura.
                    */}
                    <TouchableOpacity style={styles.button2} onPress={() => this.openInfoModal(asignatura)}>
                      <Text style={styles.buttonText2} allowFontScaling={false}>Información</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

               {/*Logica para el semestre numero 2, en este apartado se renderiza información sobre 
               las asignaturas del Semestre 2 de una carrera específica, 
               mostrándola solo si hay asignaturas para ese semestre*/}
            {semesterData[item.id].semester2.length > 0 && (
              <View style={styles.semesterContent}>
                <View style={[styles.colorSquare, { backgroundColor: item.color, width: 40, height: 7, borderRadius: 5, marginRight: 10 }]} />
                <Text style={styles.semesterTitle} allowFontScaling={false}>Semestre 2</Text>
                {semesterData[item.id].semester2.map((asignatura, index) => (
                  <View key={`${asignatura.Sigla}-${index}`} style={styles.assignmentContainer}>
                    <View style={styles.assignmentRow}>
                      <Text style={styles.tableCellAsignatura} allowFontScaling={false}>{asignatura.Asignatura}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                      <Text style={styles.sectionLabel} allowFontScaling={false}>Sección:</Text>
                      <Text style={styles.tableCellSeccion} allowFontScaling={false}>{asignatura.Seccion}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                      <Text style={styles.sectionLabel} allowFontScaling={false}>Sigla:</Text>
                      <Text style={styles.tableCellSeccion} allowFontScaling={false}>{asignatura.Sigla}</Text>
                    </View>
                    {/*Si se presiona este boton, se llama a la funcion fetchsalasData 
                    la cual abre un modal, con los datos de esa asignatura en particular, ya que se pasa como parametro
                    la asignatura, y se envia un cuerpo el cual tiene todas sus propiedades internas.
                    */}
                    <TouchableOpacity style={styles.button} onPress={() => this.fetchSalasData(asignatura)}>
                      <Text style={styles.buttonText} allowFontScaling={false}>Ver Salas</Text>
                    </TouchableOpacity>
                    {/*Si se presiona este boton, se llama a la funcion openInfoModal 
                    la cual abre un modal, con la informacion mostrada en una flatlist de esa asignatura.
                    */}
                    <TouchableOpacity style={styles.button2} onPress={() => this.openInfoModal(asignatura)}>
                      <Text style={styles.buttonText2} allowFontScaling={false}>Info Asignatura</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };


  
// Funcion para obtener colores aleatorios en las tarjetas
  getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  colorContainer: {
    alignItems: 'center',
    height: 170,
  },
  TituloP: {
    color: '#ffffff',
    fontSize: 28,
    top: -90,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  totalesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white', // Fondo blanco pastel
    borderRadius: 10,
    marginVertical: 20,
    elevation: 3,
    top: -90, // Colocado ligeramente por debajo de colorContainer
    left: 60, // Alineación a la izquierda
    right: -10, // Mantiene el ancho dentro de los límites
    zIndex: 2, // Asegúrate de que esté por encima de
    height: 70,
    paddingVertical: 6,
  },
  totalBox: {
    alignItems: 'center',
    left: -40,
  },
  totalNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  totalLabel: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  tableContainer: {
    paddingHorizontal: 10,
    top: -80,
  },
  cardList: {
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 2,
    height: 90,
  },
  colorSquare: {
    width: 40,
    height: 7,
    borderRadius: 5,
    marginRight: 15,
    top: 5,
    left: 15,
    position: 'absolute',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  asignaturasText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  arrowImage: {
    width: 20,
    height: 20,
  },
  semesterContainer: {
    marginVertical: 10,
    paddingBottom: 10,
  },
  semesterTitle: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  table: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  headerGradient: {
    backgroundColor: '#40b9e5',
    paddingVertical: 10,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
  },
  tableHeaderText: {
    flex: 1,
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
    padding: 5,
    textAlign: 'center',
    color: 'white',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    backgroundColor: '#ffffff',
  },
  tableCellAsignatura: {
    flex: 1,
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  tableCellSeccion: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'right', // Alinea el texto a la derecha
  },
  iconCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    left: 2,
  },
  iconCell23: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    left: 2,
  },
  logoInfo: {
    width: 24,
    height: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Colocar el contenido del modal en la parte inferior
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '55%', // Ajustar la altura a la mitad de la pantalla
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
    color: 'black',
  },
  listItemContainer: {
    marginBottom: 10,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listText: {
    fontSize: 16,
    color: 'black',
    width: '50%',
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  customText: {
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: '#40b9e5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 30,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Montserrat-Regular', // Cambia aquí por la fuente que desees
  },
  semesterContent: {
    marginVertical: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    width: '90%', // Ajusta el ancho del contenedor de los ítems
    alignSelf: 'center', // Centra el contenedor horizontalmente
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 10,
  },
  
  assignmentContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  
  assignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Esto asegura que el contenido se distribuya a los extremos
    marginBottom: 10,
    width: '100%', // Asegúrate de que ocupe todo el ancho disponible
},
  assignmentIcon: {
    width: 30, // Ajusta el tamaño del ícono según sea necesario
    height: 30,
    marginRight: 10,
    position: 'absolute',

  },
  
  sectionLabel: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  },
  
  button: {
    backgroundColor: '#40b9e5',
    borderRadius: 5,
    padding: 8,
    marginVertical: 4,
    alignItems: 'center',
    borderWidth: 0.2,
    width: '100%',
  },

  button2: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 8,
    marginVertical: 4,
    alignItems: 'center',
    borderWidth: 0.5,
    width: '100%',
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  buttonText2: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  
  
});

export default ManeTokens(CargaAcademica);
