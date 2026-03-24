export const dynamic = 'force-dynamic';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { colors, radius, spacing } from '../constants/theme';

// ── Helpers ──────────────────────────────────────────────────

const Stars = ({ rating }) => {
  if (!rating) return null;
  const full = Math.round(rating);
  return (
    <Text style={styles.stars}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <Text style={styles.ratingNum}> {rating.toFixed(1)}</Text>
    </Text>
  );
};

// ── Main component ───────────────────────────────────────────

const Gymfinder = () => {
  const [location, setLocation] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let subscription = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied.');
          return;
        }

        // watchPositionAsync is more reliable than getCurrentPositionAsync on
        // emulators — it picks up mock locations as soon as they are set.
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 1000 },
          (loc) => {
            setLocation(loc);
            subscription?.remove();
            subscription = null;
          }
        );
      } catch (e) {
        setErrorMsg('Location unavailable. Please enable location services and try again.');
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (location) {
      fetchGyms(location.coords.latitude, location.coords.longitude);
    }
  }, [location]);

  const fetchGyms = async (latitude, longitude) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=gym&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      setGyms(response.data.results);
    } catch (error) {
      console.error('Error fetching gyms:', error);
    }
  };

  const panToGym = (gym) => {
    mapRef.current?.animateToRegion(
      {
        latitude: gym.geometry.location.lat,
        longitude: gym.geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600
    );
  };

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Getting your location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          pinColor={colors.accentBlue}
        />
        {gyms.map((gym, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: gym.geometry.location.lat,
              longitude: gym.geometry.location.lng,
            }}
            title={gym.name}
            pinColor={colors.accentOrange}
            onPress={() => setSelectedGym(gym)}
          />
        ))}
      </MapView>

      {/* Gym list panel */}
      <View style={styles.listPanel}>
        <Text style={styles.listHeader}>
          {gyms.length > 0 ? `${gyms.length} Gyms Nearby` : 'Searching for gyms…'}
        </Text>
        <FlatList
          data={gyms}
          keyExtractor={(_, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gymRow}
              onPress={() => { panToGym(item); setSelectedGym(item); }}
              activeOpacity={0.75}
            >
              <View style={styles.gymRowMain}>
                <Text style={styles.gymName} numberOfLines={1}>{item.name}</Text>
                {item.vicinity ? (
                  <Text style={styles.gymAddress} numberOfLines={1}>{item.vicinity}</Text>
                ) : null}
              </View>
              <View style={styles.gymRowRight}>
                <Stars rating={item.rating} />
                {item.opening_hours != null && (
                  <Text style={[
                    styles.openBadge,
                    { color: item.opening_hours.open_now ? colors.accentGreen : colors.deleteRed }
                  ]}>
                    {item.opening_hours.open_now ? 'Open' : 'Closed'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Gym detail modal */}
      {selectedGym && (
        <Modal
          transparent
          animationType="slide"
          visible={!!selectedGym}
          onRequestClose={() => setSelectedGym(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedGym(null)}
          >
            <View style={styles.detailCard} onStartShouldSetResponder={() => true}>
              <Text style={styles.detailName}>{selectedGym.name}</Text>
              {selectedGym.vicinity ? (
                <Text style={styles.detailAddress}>{selectedGym.vicinity}</Text>
              ) : null}
              <View style={styles.detailRow}>
                {selectedGym.rating != null && (
                  <View style={styles.detailPill}>
                    <Stars rating={selectedGym.rating} />
                    {selectedGym.user_ratings_total != null && (
                      <Text style={styles.detailMeta}>
                        {' '}({selectedGym.user_ratings_total.toLocaleString()} reviews)
                      </Text>
                    )}
                  </View>
                )}
                {selectedGym.opening_hours != null && (
                  <View style={[
                    styles.detailPill,
                    { borderColor: selectedGym.opening_hours.open_now ? colors.accentGreen + '50' : colors.deleteRed + '50' }
                  ]}>
                    <Text style={{
                      color: selectedGym.opening_hours.open_now ? colors.accentGreen : colors.deleteRed,
                      fontWeight: '700', fontSize: 13,
                    }}>
                      {selectedGym.opening_hours.open_now ? '● Open now' : '● Closed'}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.dismissBtn} onPress={() => setSelectedGym(null)}>
                <Text style={styles.dismissBtnText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  loadingText: { color: colors.textSecondary, fontSize: 15 },
  errorText: { color: colors.error, fontSize: 15, textAlign: 'center', padding: 20 },

  // Map takes top 55% of screen
  map: { width: '100%', height: '55%' },

  // Gym list panel
  listPanel: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  gymRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  gymRowMain: { flex: 1, marginRight: spacing.sm },
  gymName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  gymAddress: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  gymRowRight: { alignItems: 'flex-end', gap: 2 },
  stars: { color: colors.accentYellow, fontSize: 12 },
  ratingNum: { color: colors.textSecondary, fontSize: 11 },
  openBadge: { fontSize: 11, fontWeight: '700' },

  // Detail modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailCard: {
    backgroundColor: colors.modalBg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    paddingBottom: 32,
  },
  detailName: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  detailAddress: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  detailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  detailMeta: { color: colors.textMuted, fontSize: 12 },
  dismissBtn: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
  },
  dismissBtnText: { color: colors.textSecondary, fontWeight: '600', fontSize: 15 },
});

export default Gymfinder;
