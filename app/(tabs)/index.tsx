import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';

const logoImage: ImageSourcePropType = { uri: 'https://i.ibb.co/VNWjz3V/runit-3.png' };

interface Event {
  name: string;
  startDate: string;
  venue: {
    city: string;
  };
  eventRegistrationUrl: string | null;
}

const Navbar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isReservableFilter, setIsReservableFilter] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regions, setRegions] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const baseUrl = 'https://www.finishers.com';

  const transformData = (data: any) => {
    return data.documents.map((event: any) => {
      let registrationUrl = event.Links && event.Links.registration 
        ? event.Links.registration
        : null;

      // Si registrationUrl contient /book, utiliser l'URL de base
      if (registrationUrl && registrationUrl.includes('/book')) {
        registrationUrl = `${baseUrl}${registrationUrl}`;
      } else if (!registrationUrl) {
        // Si registrationUrl est nul, utiliser l'URL de base (ou définir une URL par défaut)
        registrationUrl = `${baseUrl}/default`;
      }

      // Assurez-vous que l'URL de base est utilisée correctement pour les autres cas
      if (registrationUrl.startsWith('https://register.finishers.com')) {
        // Pas de modification nécessaire pour les URLs spécifiques
      } else if (!registrationUrl.includes('/book') && !registrationUrl.startsWith(baseUrl)) {
        registrationUrl = `${baseUrl}${registrationUrl}`;
      }

      return {
        name: event.eventName || 'Pas de titre',
        startDate: event.editionStartDate || 'Pas de date',
        venue: {
          city: event.city || 'Pas de ville',
        },
        eventRegistrationUrl: registrationUrl,
      };
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const page1Response = await axios.get('https://finishersrewrited-production.up.railway.app/api/documents?page=1');
        const page2Response = await axios.get('https://finishersrewrited-production.up.railway.app/api/documents?page=2');
  
        const allEvents = [
          ...transformData(page1Response.data),
          ...transformData(page2Response.data),
        ];
  
        const uniqueRegions = Array.from(new Set(allEvents.map(event => event.venue.city)));
        setRegions(uniqueRegions);
  
        allEvents.sort((a: Event, b: Event) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateA - dateB;
        });
  
        setEvents(allEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    };
  
    fetchEvents();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...events];
      
      if (isReservableFilter) {
        filtered = filtered.filter(event => event.eventRegistrationUrl && event.eventRegistrationUrl.includes('/book'));
      }
      
      if (selectedRegion) {
        filtered = filtered.filter(event => event.venue.city === selectedRegion);
      }

      setFilteredEvents(filtered);
    };

    applyFilters();
  }, [events, isReservableFilter, selectedRegion]);

  const handlePress = (url: string | null) => {
    console.log('URL cliquée:', url); // Ajout de log pour débogage
    if (url) {
      Linking.openURL(url).catch(() => {
        alert('Impossible d\'ouvrir l\'URL.');
      });
    } else {
      alert('URL d\'inscription indisponible.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.navbar}>
        <View style={styles.container}>
          <Image source={logoImage} style={styles.smallLogo} />
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.mainContent}>
          <Text style={styles.text}>Bienvenue sur RunIt !</Text>
        </View>
        <Text style={styles.text2}>Votre application qui vous montre tous les petits marathons !</Text>
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.filterButtonText}>Filtrer</Text>
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={[styles.dropdownItem, isReservableFilter && styles.dropdownItemActive]}
              onPress={() => setIsReservableFilter(!isReservableFilter)}
            >
              <Text style={styles.dropdownItemText}>Réservable</Text>
            </TouchableOpacity>
            <Text style={styles.dropdownSubtitle}>Région</Text>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => setSelectedRegion(null)}
            >
              <Text style={styles.dropdownItemText}>Toutes</Text>
            </TouchableOpacity>
            {regions.map((region, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownItem, selectedRegion === region && styles.dropdownItemActive]}
                onPress={() => setSelectedRegion(region)}
              >
                <Text style={styles.dropdownItemText}>{region}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.cardsContainer}>
        {filteredEvents.map((event, index) => {
          const hasBookLink = event.eventRegistrationUrl && event.eventRegistrationUrl.includes('/book');
          const isRegisterLink = event.eventRegistrationUrl && event.eventRegistrationUrl.startsWith('https://register.finishers.com');
          const hasNoInfo = !event.eventRegistrationUrl || event.eventRegistrationUrl === `pas d'information`;
          
          // Détermine le texte et le style du bouton en fonction des critères
          const buttonText = hasBookLink 
            ? 'Réserver cette course' 
            : (isRegisterLink || hasNoInfo) 
              ? 'Infos'
              : 'Pas d\'informations';

          const buttonStyle = hasBookLink
            ? styles.buttonBookable
            : (isRegisterLink || hasNoInfo) ? styles.buttonInfo : styles.buttonNoInfo;

          const finalUrl = event.eventRegistrationUrl;

          return (
            <View style={styles.card} key={index}>
              <Text style={styles.textCard}>{event.name}</Text>
              <Text style={styles.textCard}>Lieu: {event.venue.city}</Text>
              <Text style={styles.textCard}>Date: {new Date(event.startDate).toLocaleDateString()}</Text>
              <TouchableOpacity
                style={[styles.button, buttonStyle]}
                onPress={() => {
                  console.log('URL du bouton pressé:', finalUrl); // Ajout de log pour débogage
                  handlePress(finalUrl);
                }}
                disabled={buttonStyle === styles.buttonNoInfo}
              >
                <Text style={styles.buttonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    backgroundColor: '#0d3b5b',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    color: '#fff',
    width: '50%',
    marginLeft: '25%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 20,
    color: '#fff',
    width: '60%',
    marginLeft: '20%',
    marginTop: '5%',
    textAlign: 'center',
    fontWeight: '300',
  },
  filtersContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#0d3b5b',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemActive: {
    backgroundColor: '#87CEFA',
  },
  dropdownItemText: {
    color: '#0d3b5b',
    fontWeight: 'bold',
  },
  dropdownSubtitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  cardsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    borderColor: '#0d3b5b',
    borderWidth: 1,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textCard: {
    textAlign: 'center',
    color: '#0d3b5b',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBookable: {
    backgroundColor: '#0d3b5b',
  },
  buttonNoInfo: {
    backgroundColor: '#d3d3d3',
  },
  buttonInfo: {
    backgroundColor: '#87CEFA',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Navbar;
