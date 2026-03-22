export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const Gymfinder = () => {
  const [location, setLocation] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchGyms(location.coords.latitude, location.coords.longitude);
    }
  }, [location]);

  const fetchGyms = async (latitude, longitude) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const radius = 5000;
    const type = 'gym';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      setGyms(response.data.results);
    } catch (error) {
      console.error('Error fetching gyms:', error);
    }
  };

  if (errorMsg) {
    return <View style={styles.container}><Text>{errorMsg}</Text></View>;
  }

  if (!location) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          pinColor='#474eff'
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
        />
        {gyms.map((gym, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: gym.geometry.location.lat,
              longitude: gym.geometry.location.lng,
            }}
            title={gym.name}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
});

export default Gymfinder;
