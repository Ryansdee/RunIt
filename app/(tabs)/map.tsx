import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, Text, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';

const logoImage: ImageSourcePropType = { uri: 'https://i.ibb.co/VNWjz3V/runit-3.png' };

interface Event {
  name: string;
  latitude: number;
  longitude: number;
  startDate: string;
  venue: {
    city: string;
  };
}

interface GroupedEvents {
  coordinates: { latitude: number; longitude: number };
  events: Event[];
}

const Navbar: React.FC = () => {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const page1Response = await axios.get('https://finishersrewrited-production.up.railway.app/api/documents?page=1');
        const page2Response = await axios.get('https://finishersrewrited-production.up.railway.app/api/documents?page=2');

        const transformData = (data: any) => {
          return data.documents.map((event: any) => ({
            name: event.eventName || 'Pas de titre',
            latitude: (event.coordinates && event.coordinates[0]) || 0,
            longitude: (event.coordinates && event.coordinates[1]) || 0,
            startDate: event.editionStartDate || 'Pas de date',
            venue: {
              city: event.city || 'Pas de ville',
            },
          }));
        };

        const allEvents = [...transformData(page1Response.data), ...transformData(page2Response.data)].sort((a: Event, b: Event) => {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

        // Group events by location
        const grouped: { [key: string]: GroupedEvents } = {};

        allEvents.forEach((event) => {
          const key = `${event.latitude}_${event.longitude}`;
          if (!grouped[key]) {
            grouped[key] = { coordinates: { latitude: event.latitude, longitude: event.longitude }, events: [] };
          }
          grouped[key].events.push(event);
        });

        setGroupedEvents(Object.values(grouped));
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.navbar}>
        <View style={styles.container}>
          <Image source={logoImage} style={styles.smallLogo} />
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 50.8503,
              longitude: 4.3517,
              latitudeDelta: 2.5,
              longitudeDelta: 2.5,
            }}
          >
            {groupedEvents.map((group, index) => (
              <Marker
                key={index}
                coordinate={group.coordinates}
                title={group.events[0].venue.city}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    {group.events.map((event, i) => (
                      <View key={i} style={[styles.calloutItem, group.events.length === 1 ? styles.singleItem : styles.gridItem]}>
                        <Text style={styles.calloutTitle}>{event.name}</Text>
                        <Text>{new Date(event.startDate).toLocaleDateString()}</Text>
                        <Text>{event.venue.city}</Text>
                      </View>
                    ))}
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 15,
  },
  navbar: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
    height: '150%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  mapContainer: {
    width: '96%',
    height: 600,
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#b0fffa3c',
  },
  calloutContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
  },
  calloutItem: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    margin: 5,
    borderRadius: 5,
    width: 100,
    height: 110,
  },
  singleItem: {
    width: '100%',
  },
  gridItem: {
    width: '35%',
  },
  calloutTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Navbar;
