import React, { useState } from "react";
import { Dimensions, FlatList, Image, ImageBackground, Linking, Modal, PixelRatio, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../ManejoDatos';

// imagenes
const uctImage = require('../../imagenes/back.jpg');
const Blackboard = require('../../imagenes/Blackboard.png');
const PortalAca = require('../../imagenes/PortalAcade.png');
const PortalEstu = require('../../imagenes/CalEstu.png');
const PortalK = require('../../imagenes/PortalK.png');
const profileImage = require('../../imagenes/sombrero.png');
const telefonoP = require('../../imagenes/telefonoP.png');
const usuariochico = require('../../imagenes/correeochico.png');
const telefonochico = require('../../imagenes/telefonochico.png');
const flechaabajo = require('../../imagenes/flecha_abajo.png');
const flechaarriba = require('../../imagenes/flecha_arriba.png');
const moduloSIG = require('../../imagenes/modulosigvu.png');
const emailuct = require('../../imagenes/emailuct.png');

// redes sociales
const youtube = require('../../imagenes/youtube.png');
const twitter = require('../../imagenes/twitter.png');
const facebook = require('../../imagenes/facebook.png');
const instagram = require('../../imagenes/instagram.png');
const tiktok = require('../../imagenes/tiktok.png');
const linkedin = require('../../imagenes/linkedin.png');

const { width, height } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const MIN_PADDING = 10;       // padding mínimo en px
const MAX_PADDING = 40;       // padding máximo en px
const BASE_PADDING_PERCENT = 0.08; // 8% del ancho base

// Calcula padding base relativo al ancho
const basePadding = width * BASE_PADDING_PERCENT;

// Ajusta padding según fontScale, pero con límites mínimos y máximos
let paddingHorizontal = basePadding / fontScale;

// Limita el padding para que no sea demasiado pequeño ni muy grande
if (paddingHorizontal < MIN_PADDING) paddingHorizontal = MIN_PADDING;
if (paddingHorizontal > MAX_PADDING) paddingHorizontal = MAX_PADDING;

// data contiene las paginas principales de los academicos, como su titulo, descripcion y su URL para navegar
const data = [
    { id: '1', image: Blackboard, title: 'Blackboard', description: 'Sitio Academico', url: 'https://educa.blackboard.com/' },
    { id: '2', image: PortalAca, title: 'Portal Académico', description: 'Sitio Academico', url: 'https://academicos.uct.cl/' },
    { id: '3', image: PortalEstu, title: 'Calificación de Estudiantes', description: 'Sitio Academico', url: 'https://calificacion.uct.cl/login2023/' },
    { id: '4', image: PortalK, title: 'Portal Kellun', description: 'Sitio Academico', url: 'https://portal.uct.cl/login2023/index.html' },
    { id: '5', image: moduloSIG, title: 'Módulo SIGVU', description: 'Sitio Academico', url: 'https://sigvu.uct.cl/' },
    { id: '6', image: emailuct, title: 'Correo UCT', description: 'Correo Univeridad Católica', url: 'https://correo.uct.cl/' },
];

//data 2, contiene el centro de ayuda de la aplicacion, con nombre de oficinas, telefonos, correos, etc.
const data2 = [
    { id: '1', title: 'Oficina de Informaciones', Telefono: '+56 452205302 ', Correo: 'info@uct.cl' },
    { id: '2', title: 'Becas y Créditos Beneficios Estudiantiles', Telefono: '+56 452 205 271 ', Correo: 'bienestarestudiantil@uct.cl' },
    { id: '3', title: 'Cuentas de Correo', Telefono: '+56 452 685 054 ', Correo: 'soportesistemas@uct.cl' },
    { id: '4', title: 'Certificado alumno regular Concentración de Notas', Telefono: '+56 452 205 237', Correo: 'certificaciones@uct.cl' },
    { id: '5', title: 'Prensa Institucional ', Telefono: '+56 452 685 140 ', Correo: 'comunicaciones@uct.cl' },
    { id: '6', title: 'Atención Médica ', Telefono: ' +56 452 205 302 ', Correo: 'bienestarestudiantil@uct.cl' },
    { id: '7', title: 'Desarrollo estudiantil Deporte Elencos Artísticos Beca Santander ', Telefono: '+56 452 205 620 ', Correo: 'dides@uct.cl' },
    { id: '8', title: 'Pago Aranceles Fondo Solidario Recaudación Deudas Otros ', Telefono: '+56 452 205 209 ', Correo: 'dcr@uct.cl' },
];


const PantallaPrincipal = () => {
    const { user, token } = useUser();
    const [modalVisible, setModalVisible] = useState(false);
    const [showData2, setShowData2] = useState(false);
    const [flechaImage, setFlechaImage] = useState(flechaabajo); 

    // esta funcion se utiliza para arreglar el nombre de la variable que viene del
    // usuario y mostrado de forma ordenada, primer nombre y primer apellido.
    const formatUserName = (fullName) => {
        const nameParts = fullName.split(" ");
        const firstName = nameParts[2];
        const lastName = nameParts[0];
        return `${firstName} ${lastName}`;
    };

// este renderItem se utiliza para mostrar las paginas web
    const renderItem = ({ item }) => (
        <View style={styles.profileContainer10}>
        <TouchableOpacity
            style={styles.eventBlock}
            onPress={() => Linking.openURL(item.url)}
        >
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title} allowFontScaling={false}>{item.title}</Text>
                <Text style={styles.eventText} allowFontScaling={false}>{item.description}</Text>
            </View>
        </TouchableOpacity>
        </View>
    );

    // este renderitem se utiliza para mostrar el centro de ayuda
    const renderData2Item = ({ item }) => (
        
        <View style={styles.data2Card}>
            <Text style={styles.data2Title} allowFontScaling={false}>{item.title}</Text>
            <View style={styles.contactContainer}>
                <Image source={telefonochico} style={styles.icon} />
                <Text selectable style={styles.data2Text} allowFontScaling={false} >Teléfono: {item.Telefono}</Text>
            </View>
            <View style={styles.contactContainer}>
                <Image source={usuariochico} style={styles.icon} />
                <Text style={styles.data2Text} allowFontScaling={false}>Correo: {item.Correo}</Text>
            </View>
        </View>
    );

    // constante que guarda la imagen de las redes sociales y sus links asociados.
    const socialMediaLinks = [
        { image: instagram, url: 'https://www.instagram.com/uctemuco/' },
        { image: facebook, url: 'https://i.mtr.cool/YYIZQPTTDK' },
        { image: linkedin, url: 'https://i.mtr.cool/CJFFZEYGEQ' },
        { image: youtube, url: 'https://i.mtr.cool/MRZZOZIIKH' },
        { image: tiktok, url: 'https://i.mtr.cool/EGDHNAEGYN' },
    ];


    const toggleData2 = () => {
        setShowData2(!showData2);
        setFlechaImage(showData2 ? flechaabajo : flechaarriba);
    };

   // Cuerpo principal el cual muestra nombre de usuario, y su correo electronico
   // y el resto de componentes como el centro de ayuda, sitios relevantes. etc.
    return (
        <ImageBackground source={uctImage} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <Image source={profileImage} style={styles.profileImage} />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileName} allowFontScaling={false}>{formatUserName(user.cn)}</Text>
                            <Text style={styles.profileSubtitle} allowFontScaling={false}>{`${user.uid}@uct.cl`}</Text>
                        </View>
                    </View>

                    <View style={styles.container2}>
                        <View style={styles.container4}>
                            <Text style={styles.title2} allowFontScaling={false}>Ayuda y Recursos</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.card} 
                            onPress={toggleData2} 
                        >
                            <View style={styles.profileContainer3}>
                                <Image source={telefonoP} style={styles.profileImage2} />
                                <View style={styles.profileTextContainer2}>
                                    <Text style={styles.helpTitle} allowFontScaling={false}>Centro de Ayuda</Text>
                                    <Text style={styles.helpDescription} allowFontScaling={false}>Para cualquier consulta, contáctanos aquí.</Text>
                                </View>
                                <Image source={flechaImage} style={styles.rightImage} />
                            </View>
                        </TouchableOpacity>

                        {/* FlatList de data2 que se muestra al pulsar la tarjeta sobre centro de ayuda */}
                        {showData2 && (
                            <FlatList
                                data={data2}
                                renderItem={renderData2Item}
                                keyExtractor={item => item.id}
                                horizontal={true} // Hacer la FlatList horizontal
                                contentContainerStyle={styles.flatlistContainer2}
                                showsHorizontalScrollIndicator={false}
                            />
                        )}

                        <View style={styles.container4}>
                            <Text style={styles.title2} allowFontScaling={false}>Sitios relevantes</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Text style={styles.title3} allowFontScaling={false}>Ver más</Text>
                            </TouchableOpacity>
                        </View>
                        {/*Esta flatlist muestra las paginas web al principio de la pantalla */}
                        <FlatList
                            data={data.slice(0, 4)} // solo muestra 4 datos de data
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.flatlistContainer}
                            scrollEnabled={false} // Desactiva el scroll en esta FlatList
                            showsVerticalScrollIndicator={false}
                        />
                        {/*Apartado para mostrar las redes sociales. */}
                        <View style={styles.cardRedes}>
                            <View style={styles.profileContainerRedes}>
                                {socialMediaLinks.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)}>
                                        <Image source={item.image} style={styles.IconosRedes} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                    </View>
                    {/*Modal que interactua con el botton ver mas, para mostrar mas paginas web */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>

                        <View style={styles.modalView}>
                            <Text style={styles.TituloModal} allowFontScaling={false}>Sitios relevantes</Text>
                              {/*Esta flatlist muestra las paginas web al pulsar ver mas, por lo que las muestra todas*/}
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.flatlistContainer2}
                            />
                            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText} allowFontScaling={false}>Cerrar</Text>
                            </Pressable>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    scrollViewContainer: {
        flexGrow: 1,
        alignItems: 'center', 
    },
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 20,
        top: Platform.OS === 'ios' ? 80 : 60,
        textAlign: 'left'
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 35,
        marginRight: 10,
        top: 10,
    },
    ContendorCerrar: {
        width: 50,
        height: 50,
        borderRadius: 35,
    
       
        position: 'absolute',
    },
    profileTextContainer: {
        flexDirection: 'column',
    },
    profileName: {
        fontSize: 24,
        fontFamily: 'Montserrat-Regular',
        color: 'white',
    },
    profileSubtitle: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat-Regular',
    },
    title2: {
        color: 'black',
        textAlign: 'left',
        fontSize: width * 0.055, // 22 si el ancho es 400
        padding: width * 0.03,  // 10 si el ancho es 400
        left: width * 0.04,     // 10 si el ancho es 400
        fontFamily: 'Montserrat-Regular',
    },
    title3: {
        color: 'black',
        textAlign: 'right',
        fontSize: 15,
        padding: 10,
        fontFamily: 'Montserrat-Regular',
     
    },
    container4: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    containerRDDDD: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 0, // Asegúrate de que no haya margen vertical
    },

    container2: {
        borderColor: 'black',
        backgroundColor: 'white',
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
        paddingTop: 20,
        marginTop: 90,
    },
    flatlistContainer: {
        paddingBottom: 0, // Cambia el padding para evitar espacio adicional
        width: '100%',
    },
    flatlistContainer2: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    eventBlock: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 30,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 15,
        marginBottom: 15,
        width: '95%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        alignSelf: 'center',
    },
    imageContainer: {
        width: 150,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 15,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Montserrat-Regular',
    },
    eventText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    modalView: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        paddingTop: 60,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center',
        
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#009bff',
        borderRadius: 30,
        padding: 10,
        elevation: 1,
        width: '95%',
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: Platform.OS === 'ios' ? 22 : 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        
    },

    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 30,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 15,
        marginBottom: 15,
        width: '95%',
        height: '11%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        alignSelf: 'center',
    },
    card2: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 30,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 15,
        marginBottom: 60,
        width: '95%',
        height: '10%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        alignSelf: 'center',
    },
    card3: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 30,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 15,
        marginBottom: 60,
        paddingHorizontal: 55, // Añadir más espacio horizontal
        width: '95%',
        height: '7%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        alignSelf: 'center',
      
    },
    cardRedes: {
        flexDirection: 'row',
        padding: 15,
        marginBottom: 60,
        paddingHorizontal: 55,  // Esto te da un espacio horizontal extra, si lo deseas.
        width: '80%',           // Ancho dinámico, ajustable según el tamaño de la pantalla.
        maxWidth: 380,          // Puedes establecer un valor máximo si quieres evitar que se haga demasiado ancho en pantallas grandes.
        height: '7%',
        alignSelf: 'center',    // Esto asegura que se mantenga centrado en la pantalla.
        paddingBottom: 80,
    },
    
    profileContainer3: {
        flexDirection: 'row',
        align: 'center',
        width: '100%', // Asegúrate de que ocupe todo el ancho de la tarjeta
    },
    profileContainerRedes: {
        flexDirection: 'row',
        width: '100%', // Asegúrate de que ocupe todo el ancho de la tarjeta
    },
    profileImage2: {
        width: 50, // Ajusta el tamaño según lo necesites
        height: 50,
        borderRadius: 25,
        marginRight: 16, // Espacio entre la imagen y el texto
    },
    IconosRedes: {
        width: 40, // Ajusta el tamaño según lo necesites
        height: 40,
        borderRadius: 25,
        marginRight: 16, // Espacio entre la imagen y el texto
        
        alignSelf: 'center',
    },
    profileTextContainer2: {
        flex: 1,
        alignItems: 'left', // Centra el texto en la tarjeta
        textAlign: 'left', // Alineación del texto
    },
    helpTitle: {
        fontSize: 20,
        textAlign: 'left', // Centra el título
        fontFamily: 'Montserrat-Regular',
        color:'black',
    },
    helpDescription: {
        fontSize: 16,
        textAlign: 'left', // Centra la descripción
        marginTop: 4,
        fontFamily: 'Montserrat-Regular',
        color: '#7a7a7a',
    },
    data2Card: {
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 20,
        width: 300, // Ajusta el ancho según sea necesario
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4, // Aumentar la altura para que la sombra esté más abajo
        },
        shadowOpacity: 0.5, // Aumentar la opacidad para una sombra más oscura
        shadowRadius: 6, // Aumentar el radio para difuminar más la sombra
        elevation: 11, // Aumentar la elevación para Android
    },
    
    data2Title: {
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        color: 'black',
        padding: 5,
        paddingLeft: 0,
    },
    data2Text: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        paddingHorizontal: 5,
        color: '#847f7f'
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, // Espacio entre los contactos
    },
    icon: {
        width: 20, // Ajusta el tamaño según lo necesites
        height: 20,
        marginRight: 10, // Espacio entre la imagen y el texto
    },
    TituloModal: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 28,
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? 0 : -20,
        padding: 5,
        color: 'black',
        
    },
    rightImage: {
        width: 20,
        height: 20,
        marginLeft: 10,
        alignSelf: 'center',
    },

    profileContainer10: {
        align: 'center',
        width: '100%', // Asegúrate de que ocupe todo el ancho de la tarjeta

    },
});

export default PantallaPrincipal;
