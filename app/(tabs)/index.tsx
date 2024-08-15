import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, Text, ScrollView, Platform } from 'react-native';

const logoImage: ImageSourcePropType = { uri: 'https://i.ibb.co/VNWjz3V/runit-3.png' };

const Navbar: React.FC = () => {
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
        <Text style={styles.text2}> Votre application qui vous montrer tout les petit marathon !</Text>
      </View>
        <View style={styles.card}>
          <Text style={styles.textCard}>Bienvenue sur RunIt !</Text>
        </View>
        <View style={styles.cardLeft}>
          <Text style={styles.textCardLeft}>Bienvenue sur RunIt !</Text>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 15, // Adds padding to the container
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
    whiteSpace: 'pre-line'
  },
  text2: {
    fontSize: 20,
    color: '#fff',
    width: '60%',
    marginLeft: '20%',
    marginTop: '5%',
    textAlign: 'center',
    fontWeight: 'light',
  },
  card:{
    width: '48%',
    padding: 10,
    borderRadius: 5,
    borderColor: '#fff',
    marginLeft: '-51%',
    marginTop: '1%',
    backgroundColor: '#0d3b5b',
  },
  textCard:{
    textAlign: 'center',
    color: '#fff',
  },
  cardLeft:{
    width: '48%',
    padding: 10,
    borderRadius: 5,
    borderColor: '#fff',
    marginLeft: '51%',
    marginTop: '-9.6%',
    backgroundColor: '#0d3b5b',
  },
  textCardLeft:{
    textAlign: 'center',
    color: '#fff',
  },
});

export default Navbar;
