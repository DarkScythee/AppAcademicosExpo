import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, ImageSourcePropType, LogBox, Platform, StyleSheet, Text, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';

LogBox.ignoreLogs([
  'Warning: useInsertionEffect must not schedule updates.'
]);

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
// Configuracion local en español.

LocaleConfig.defaultLocale = 'es';
const Uctlogo = require('../../imagenes/UCT_logoC.png');
const GoogleCalendarLogo = require('../../imagenes/GoogleC.png');

type RawApiEvent = {
  Fecha_inicio: string;
  Fecha_fin?: string;
  Nombre_evento: string;
  Imagen_local?: ImageSourcePropType;
};

type RawGoogleEvent = {
  id: string;
  summary: string;
  htmlLink: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
};

type MergedEvent = {
  id: string;
  title: string;
  hour: string;
  duration: string;
  tipo: 'inicio' | 'fin';
  isGoogleEvent: boolean;
  link?: string;
  imageUrl?: ImageSourcePropType; 
};

type AgendaSection = {
  title: string; // "YYYY-MM-DD"
  data: MergedEvent[];
};


const LoadingImage = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000, // velocidad de rotación (2 segundos)
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loaderestilo}>
      <Animated.Image
        source={require('../../imagenes/UCT_logoC.png')}
        style={{
          width: 100,
          height: 100,
          resizeMode: 'contain',
          transform: [{ rotate: rotation }],
        }}
      />
    </View>
  );
};


const CalendarioAca = () => {
  const [sections, setSections] = useState<AgendaSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false); // Nuevo estado
  const [showAgenda, setShowAgenda] = useState(false);

  const today = moment().format('YYYY-MM-DD');
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const loadData = useCallback(async () => {
  setLoading(true);
  const [apiData, googleData] = await Promise.all([
    fetchApiEvents(),
    fetchGoogleEvents()
  ]);
  
  processEventsData(apiData, googleData);
  await delay(2000);
  setLoading(false);
  setIsReady(true); // Ya está listo para mostrar contenido
}, []); // El array vacío indica que esta función no depende de variables externas



  const fetchApiEvents = async (): Promise<RawApiEvent[]> => {
    try {
        const response = await fetch('https://api-appacademicos.uct.cl/ConsultasFechas', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEb21pbmlvIiwiaWF0IjoxNzM0MTQ3NTQ1LCJzdWIiOiJSdXRVc3VhcmlvIn0.O_Lne8YoIIKMZ64GUjGo1G8gkyU6OiklmtBRXtzH1NA`,
            'Content-Type': 'application/json'
          }
        });
      return await response.json();
    } catch (err) {
      console.error('API error', err);
      return [];
    }
  };

  const fetchGoogleEvents = async (): Promise<RawGoogleEvent[]> => {
    const CALENDAR_ID = 'mjancidakis2020@alu.uct.cl';
    const API_KEY = 'AIzaSyAQ0GdogqqLnrr80I-CTz71Q5QN85amHiI';
    const beginDate = moment().toISOString();
    let allEvents: RawGoogleEvent[] = [];
    let nextPageToken: string | null = null;

    try {
      do {
        let url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${beginDate}&singleEvents=true&orderBy=startTime&maxResults=249`;
        if (nextPageToken) {
          url += `&pageToken=${nextPageToken}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const result = await response.json();
        allEvents = allEvents.concat(result.items || []);
        nextPageToken = result.nextPageToken;
      } while (nextPageToken && allEvents.length < 249);

      return allEvents;
    } catch (err: any) {
      console.error('Google error:', err.message);
      Alert.alert(
      'Permiso necesario',
      'No se pudieron obtener los eventos de Google Calendar. Asegúrate de que tu calendario esté configurado como público o compartido correctamente desde tu cuenta de Google.'
    );

      return [];
    }
  };

  const formatDate = (input: string) => {
    const date = new Date(input);
    return moment(date).format('HH:mm');
  };

  const processEventsData = (
    apiEvents: RawApiEvent[],
    googleEvents: RawGoogleEvent[]
  ) => {
    const merged: { [date: string]: MergedEvent[] } = {};

    // API propia
    apiEvents.forEach((item, index) => {
  if (!item.Fecha_inicio) return; // Validación por seguridad

  const startDate = item.Fecha_inicio.slice(0, 10);

  const hour = formatDate(item.Fecha_inicio);

  const eventoInicio: MergedEvent = {
    id: `api-${index}-start`,
    title: `${item.Nombre_evento}`,
    hour,
    duration: '',
    tipo: 'inicio',
    isGoogleEvent: false,
    imageUrl: Uctlogo 
  };

  if (!merged[startDate]) merged[startDate] = [];
  merged[startDate].push(eventoInicio);

  if (item.Fecha_fin) {
    const endDate = item.Fecha_fin.slice(0, 10);
    const endHour = formatDate(item.Fecha_fin);

    const eventoFin: MergedEvent = {
      id: `api-${index}-end`,
      title: `${item.Nombre_evento}`,
      hour: endHour,
      duration: '',
      tipo: 'fin',
      isGoogleEvent: false,
      imageUrl: Uctlogo
    };

    if (!merged[endDate]) merged[endDate] = [];
    merged[endDate].push(eventoFin);
  }
});


    // Google Calendar
    googleEvents.forEach(event => {
  const startStr = event.start?.dateTime || event.start?.date;
  const endStr = event.end?.dateTime || event.end?.date;

  if (!startStr) return; // Ignora eventos sin fecha de inicio

  const startDate = startStr.slice(0, 10);
  const startEvent: MergedEvent = {
    id: `${event.id}-start`,
    title: `${event.summary}`,
    hour: formatDate(startStr),
    duration: '',
    tipo: 'inicio',
    isGoogleEvent: true,
    link: event.htmlLink,
    imageUrl: GoogleCalendarLogo
  };

  if (!merged[startDate]) merged[startDate] = [];
  merged[startDate].push(startEvent);

  if (endStr) {
    const endDate = endStr.slice(0, 10);

    if (startDate !== endDate) {
      const endEvent: MergedEvent = {
        id: `${event.id}-end`,
        title: `${event.summary}`,
        hour: formatDate(endStr),
        duration: '',
        tipo: 'fin',
        isGoogleEvent: true,
        link: event.htmlLink,
        imageUrl: GoogleCalendarLogo
      };

      if (!merged[endDate]) merged[endDate] = [];
      merged[endDate].push(endEvent);
    }
  }
});


    // Convertir a secciones ordenadas
    const MAX_DAYS = 14;
  const ordered = Object.keys(merged)
  .sort()
  //.slice(0, MAX_DAYS) // Limita a los primeros 14 días
  .map(date => ({
    title: date,
    data: merged[date]
  }));


    setSections(ordered);
  };

  useEffect(() => {
  loadData();
}, [loadData]);

const markedDates = useMemo(() => {
    return sections.reduce((acc, sec) => {
      acc[sec.title] = { marked: true };
      return acc;
    }, {} as { [key: string]: { marked: boolean } });
  }, [sections]);

  useEffect(() => {
    if (isReady && sections.length > 0) {
      const t = setTimeout(() => setShowAgenda(true), 300);
      return () => clearTimeout(t);
    }
  }, [isReady, sections]);

  const RenderItem = React.memo(({ item }: { item: MergedEvent }) => (
  <View
    style={styles.itemContainer}
  >
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemHour}>
        {item.tipo === 'inicio' ? 'Inicio: ' : 'Término: '}
        {item.hour}
      </Text>
    </View>
    {item.imageUrl && (
      <Image
        source={item.imageUrl}
        style={styles.image}
        resizeMode="contain"
      />
    )}
  </View>
));



  return (
  <>
    {loading && !isReady && <LoadingImage />}
    
    {isReady && (
      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 55 : 35, paddingBottom: 80 }}>
        <CalendarProvider date={today} showTodayButton todayBottomMargin={120}>
          <ExpandableCalendar
            firstDay={1}
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: '#37bbed',
              selectedDayTextColor: '#fff',
              todayTextColor: '#37bbed',
              dayTextColor: '#000',
              textDisabledColor: '#ccc',
              arrowColor: '#127ea7',
              monthTextColor: '#127ea7',
              textSectionTitleColor: '#444',
            }}
          />
          <AgendaList
            sections={sections}
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={item => item.id}
            sectionStyle={styles.section}
            refreshing={loading}
            onRefresh={loadData}
            initialNumToRender={2}
    maxToRenderPerBatch={10}
    windowSize={7}
          />
        </CalendarProvider>
      </View>
    )}
  </>
);

};

export default CalendarioAca;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 6,
    padding: 10,
    elevation: 2,
     flexDirection: 'row',  // Alinea el contenido en fila
    justifyContent: 'space-between', // Deja espacio entre texto e imagen
    alignItems: 'center',  // Centra los elementos verticalmente
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemHour: {
    color: '#666',
    marginTop: 4
  },
  section: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0'
  },
  image: {
    height: 60,
    width: 60,  // Ajusta el tamaño de la imagen según lo necesites
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,  // Permite que el texto ocupe el espacio disponible
    marginRight: 25,
  },
  loaderestilo:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  

});
