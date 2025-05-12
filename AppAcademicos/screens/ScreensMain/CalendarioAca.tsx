import React, { useCallback, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, WeekCalendar } from 'react-native-calendars';

// ✅ Tipos de ítems y estructura de datos
type AgendaItemType = {
  hour: string;
  duration: string;
  title: string;
};

type AgendaData = {
  [date: string]: AgendaItemType[];
};

// 📆 Datos simulados de agenda
const rawAgendaItems: AgendaData = {
  '2025-05-12': [
    {hour: '12pm', duration: '1h', title: 'Meeting with Juan'}
  ],
  '2025-05-13': [
    {hour: '2pm', duration: '2h', title: 'Lunch with Maria'}
  ]
};

// 🔄 Convertimos a secciones
const ITEMS = Object.keys(rawAgendaItems).map(date => ({
  title: date,
  data: rawAgendaItems[date]
}));

// 📍 Fechas marcadas
const getMarkedDates = () => {
  const marked: {[date: string]: {marked: boolean}} = {};
  for (const date of Object.keys(rawAgendaItems)) {
    marked[date] = {marked: true};
  }
  return marked;
};

// 🎨 Tema básico
const themeColor = '#ffff00';
const lightThemeColor = '#F0F4F8';
const theme = {
  selectedDayBackgroundColor: themeColor,
  todayTextColor: themeColor,
  dotColor: themeColor,
  arrowColor: themeColor,
  monthTextColor: themeColor,
  textMonthFontWeight: 'bold'
};

// 🟢 Componente de ítem de agenda simple
const AgendaItem = ({item}: {item: AgendaItemType}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemHour}>{item.hour}</Text>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDuration}>{item.duration}</Text>
    </View>
  );
};

// ⬅️ Iconos (puedes reemplazar por imágenes si lo deseas)
const leftArrowIcon = undefined;
const rightArrowIcon = undefined;
const CHEVRON = undefined;

interface Props {
  weekView?: boolean;
}

const ExpandableCalendarScreen = ({weekView}: Props) => {
  const marked = useRef(getMarkedDates());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  const calendarRef = useRef<{toggleCalendarPosition: () => boolean}>(null);
  const rotation = useRef(new Animated.Value(0));

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }, []);

  const renderHeader = useCallback(
    (date?: any) => {
      const rotationInDegrees = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-180deg']
      });

      return (
        <TouchableOpacity style={styles.header} onPress={toggleCalendarExpansion}>
          <Text style={styles.headerTitle}>
            {date?.toString('MMMM yyyy') || ''}
          </Text>
          <Animated.Image
            source={CHEVRON}
            style={{
              transform: [{rotate: '90deg'}, {rotate: rotationInDegrees}],
              width: 10,
              height: 10
            }}
          />
        </TouchableOpacity>
      );
    },
    [toggleCalendarExpansion]
  );

  const onCalendarToggled = useCallback(
    (isOpen: boolean) => {
      rotation.current.setValue(isOpen ? 1 : 0);
    },
    []
  );

  const renderItem = useCallback(({item}: {item: AgendaItemType}) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[0]?.title}
      showTodayButton
      theme={todayBtnTheme.current}
    >
      {weekView ? (
        <WeekCalendar
          firstDay={1}
          markedDates={marked.current}
        />
      ) : (
        <ExpandableCalendar
          renderHeader={renderHeader}
          ref={calendarRef}
          onCalendarToggled={onCalendarToggled}
          firstDay={1}
          markedDates={marked.current}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
      />
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 6,
    elevation: 2
  },
  itemHour: {
    fontSize: 12,
    color: '#888'
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 2
  },
  itemDuration: {
    fontSize: 12,
    color: '#666'
  }
});
