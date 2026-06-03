import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Text, TouchableOpacity, ActivityIndicator, Alert, Platform, ScrollView, Modal, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Navigation, Layers, MessageSquare, Flame, TrendingUp, Skull, Globe } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// PALETA DE COLORES - UI
const COLORS = {
  PRENDIDO: "#4ade80",
  VENGAN: "#fbbf24",
  PAJA: "#ef4444",
  WINE_RED: "#722F37",
  USER: "#7f2da8ff", // Actualizado por el usuario
  UI_BG: "#23131F"
};

/**
 * BASE DE DATOS MASIVA - REGIÓN METROPOLITANA
 */
const RM_BARS_FULL_DB = [
  { id: 1, name: "La Piojera", lat: -33.4336, lon: -70.6521, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 2, name: "Liguria Lastarria", lat: -33.4385, lon: -70.6405, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 3, name: "Bocanáriz", lat: -33.4383, lon: -70.6412, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 4, name: "Chipe Libre", lat: -33.4383, lon: -70.6414, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 5, name: "Bar Berri", lat: -33.4388, lon: -70.6402, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 6, name: "Cervecería Nac.", lat: -33.4391, lon: -70.6398, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 7, name: "Bar El Tunel", lat: -33.4344, lon: -70.6548, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 8, name: "Bar Loreto", lat: -33.4312, lon: -70.6385, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 9, name: "Bar Constitución", lat: -33.4263, lon: -70.6348, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 10, name: "Kross Bar Bella", lat: -33.4318, lon: -70.6351, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 11, name: "Patio Bellavista", lat: -33.4332, lon: -70.6358, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 12, name: "Siete Negronis", lat: -33.4300, lon: -70.6318, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 13, name: "Liguria M. Montt", lat: -33.4300, lon: -70.6173, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 14, name: "Bar La Virgen", lat: -33.4301, lon: -70.6175, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 15, name: "Kross Bar Provid.", lat: -33.4234, lon: -70.6122, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 16, name: "Bar La Provid.", lat: -33.4079, lon: -70.5732, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 17, name: "Red2One", lat: -33.4116, lon: -70.6033, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 18, name: "Tamango Bar", lat: -33.3917, lon: -70.5824, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 19, name: "Tramonto Bar", lat: -33.3986, lon: -70.5843, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 20, name: "Zanzibar", lat: -33.3857, lon: -70.5599, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 21, name: "La Batuta", lat: -33.4567, lon: -70.5978, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 22, name: "Bar de René", lat: -33.4480, lon: -70.6270, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 23, name: "Ruca Bar", lat: -33.4470, lon: -70.6270, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 25, name: "Kunstmann Bar", lat: -33.4568, lon: -70.5979, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 26, name: "Rústico BrewPub", lat: -33.5134, lon: -70.7582, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 27, name: "El Late Maipú", lat: -33.5115, lon: -70.7602, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 28, name: "Civilo Restobar", lat: -33.5097, lon: -70.7614, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 30, name: "Bar Vintage", lat: -33.3644, lon: -70.7347, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 31, name: "Club Caribeño", lat: -33.3734, lon: -70.7134, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 32, name: "Donde Ramon", lat: -33.3706, lon: -70.7363, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 33, name: "Calle Calle R.", lat: -33.4019, lon: -70.7128, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 35, name: "Plaza Pub P.Alto", lat: -33.6130, lon: -70.5760, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 36, name: "La Florida Resto", lat: -33.5220, lon: -70.5980, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 37, name: "San Bdo Pub", lat: -33.5920, lon: -70.7050, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 38, name: "Taverna Sur", lat: -33.5500, lon: -70.6500, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 43, name: "The Jazz Corner", lat: -33.4443, lon: -70.6288, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 45, name: "La Oficina Pub", lat: -33.5105, lon: -70.7580, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 50, name: "El Hoyo", lat: -33.4530, lon: -70.6710, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 51, name: "Factoría Franklin", lat: -33.4750, lon: -70.6480, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 52, name: "Uncle Fletch", lat: -33.4245, lon: -70.6135, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 53, name: "Dandee Tobalaba", lat: -33.4210, lon: -70.6010, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 54, name: "H de Hamburgesa", lat: -33.4535, lon: -70.5975, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 55, name: "Club Chocolate", lat: -33.4315, lon: -70.6340, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 56, name: "Borde Río", lat: -33.3865, lon: -70.5615, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 57, name: "Tiramisú EL GOLF", lat: -33.4150, lon: -70.5995, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 58, name: "Resto Pajaritos", lat: -33.4950, lon: -70.7450, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 59, name: "Kross Bar Florida", lat: -33.5240, lon: -70.5970, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 60, name: "Peñalolén Rock", lat: -33.4800, lon: -70.5400, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 61, name: "Macul Gastro", lat: -33.4900, lon: -70.5900, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 62, name: "El Llano Resto", lat: -33.4880, lon: -70.6520, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 63, name: "Gran Avenida Bar", lat: -33.5100, lon: -70.6580, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 64, name: "Chicureo Wine", lat: -33.3050, lon: -70.6750, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
  { id: 65, name: "Lampa Resto", lat: -33.2850, lon: -70.8750, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
];

const getLeafletHTML = (lat, lon) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; background-color: ${COLORS.UI_BG}; overflow: hidden; }
        #map { height: 100vh; width: 100vw; background: ${COLORS.UI_BG}; }
        /* ELIMINADO FILTRO DE COLOR PARA RECUPERAR VISIBILIDAD PURA */
        .user-location-dot { width: 14px; height: 14px; background: ${COLORS.USER}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${COLORS.USER}; }
        .bar-pin { width: 16px; height: 16px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #fff; transition: background 0.3s; z-index: 1; }
        /* Nueva 'Aura' de actividad: Una sola sombra procesada por hardware por bar */
        .activity-aura { 
            position: absolute; width: 30px; height: 30px; border-radius: 50%; 
            top: -7px; left: -7px; pointer-events: none; 
            opacity: 0.3; filter: blur(4px); transform: scale(1);
        }
        .bar-label { background: rgba(0,0,0,0.85); color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 8px; white-space: nowrap; margin-top: 6px; border: 1px solid rgba(255,255,255,0.1); font-weight: 900; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .zoom-out .bar-label, .moving .bar-label { display: none; }
        .zoom-out .activity-aura, .moving .activity-aura { display: none; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // CONFIGURACIÓN DE "MUNDO BLOQUEADO" - Solo Región Metropolitana
        var RM_BOUNDS = [[-34.4, -71.7], [-32.8, -69.9]];
        
        var map = L.map('map', { 
            zoomControl: false, 
            attributionControl: false, 
            preferCanvas: true,
            minZoom: 10,        
            maxBounds: RM_BOUNDS, 
            maxBoundsViscosity: 1.0 
        }).setView([${lat}, ${lon}], 13);
        
        // MAPA NATIVO OSCURO (CartoDB) - Cero Lag de procesamiento de color
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            bounds: RM_BOUNDS, 
            noWrap: true, 
            minNativeZoom: 10, 
            subdomains: 'abcd',
            keepBuffer: 4,          // Mantener más tiles en memoria (precarga)
            updateWhenIdle: false,  // Actualizar mientras se mueve para suavidad
            keepBuffer: 8           // Buffer extendido para evitar parpadeos
        }).addTo(map);
        
        var barsLayer = L.featureGroup().addTo(map);
        var markers = {};
        
        var userMarker = L.marker([${lat}, ${lon}], {
            zIndexOffset: 1000,
            icon: L.divIcon({ className: '', html: '<div class="user-location-dot"></div>', iconSize: [14, 14], iconAnchor: [7, 7] })
        }).addTo(map);

        window.renderBars = function(bars) {
            bars.forEach(bar => {
                var v = bar.votes || {prendido:0, vengan:0, paja:0};
                var max = Math.max(v.prendido, v.vengan, v.paja);
                var color = max === 0 ? "${COLORS.WINE_RED}" : (v.prendido === max ? "${COLORS.PRENDIDO}" : (v.vengan === max ? "${COLORS.VENGAN}" : "${COLORS.PAJA}"));
                
                var aura = "";
                var total = v.prendido + v.vengan + v.paja;
                if (total > 0) {
                    var scale = Math.min(1.5, 1 + (total * 0.05));
                    aura = '<div class="activity-aura" style="background:'+color+'; transform: scale('+scale+')"></div>';
                }

                var html = '<div style="display:flex;flex-direction:column;align-items:center;position:relative;">' +
                           aura +
                           '<div class="bar-pin" style="background:'+color+'"></div>' +
                           '<div class="bar-label">' + bar.name + '</div></div>';
                
                if (markers[bar.id]) {
                    if (markers[bar.id]._html !== html) {
                        markers[bar.id].setIcon(L.divIcon({ className: 'bar-container', html: html, iconSize: [16, 16], iconAnchor: [8, 16] }));
                        markers[bar.id]._html = html;
                    }
                } else {
                    markers[bar.id] = L.marker([bar.lat, bar.lon], { 
                        icon: L.divIcon({ className: 'bar-container', html: html, iconSize: [16, 16], iconAnchor: [8, 16] }) 
                    }).addTo(barsLayer);
                    markers[bar.id]._html = html;
                }
            });
        };

        window.updateLocation = function(la, lo) {
            userMarker.setLatLng([la, lo]);
        };

        map.on('zoomend', function() {
            var z = map.getZoom();
            if (z < 12) document.body.classList.add('zoom-out');
            else document.body.classList.remove('zoom-out');
        });

        // Modo 'Moving' para máximo rendimiento durante el zoom/pan
        var moveEndTimer = null;
        map.on('movestart', function() { document.body.classList.add('moving'); });
        map.on('moveend', function() { 
            clearTimeout(moveEndTimer);
            moveEndTimer = setTimeout(() => { document.body.classList.remove('moving'); }, 100);
        });

        var throttleTimer = null;
        map.on('move', function() {
            if (throttleTimer) return;
            throttleTimer = setTimeout(function() {
                var center = map.getCenter();
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_MOVE', center: { lat: center.lat, lon: center.lng } }));
                throttleTimer = null;
            }, 500); // 500ms de calma durante el movimiento
        });

        window.renderBars(${JSON.stringify(RM_BARS_FULL_DB)});
    </script>
</body>
</html>
`;

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [bars, setBars] = useState(RM_BARS_FULL_DB);
  const [isSimulated, setIsSimulated] = useState(true);
  const [nearbyIds, setNearbyIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [serverUrl, setServerUrl] = useState("");
  const [isNetworkModalVisible, setIsNetworkModalVisible] = useState(false);
  const [tempIp, setTempIp] = useState("");
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [isChecking, setIsChecking] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [pendingVote, setPendingVote] = useState(null);
  const [voteCountdown, setVoteCountdown] = useState(0);
  const webViewRef = useRef(null);
  const confirmingVoteRef = useRef(false);

  const normalizeUrl = useCallback((input) => {
    if (!input) return "";
    input = input.trim();
    if (input.startsWith("http://") || input.startsWith("https://")) {
      return input;
    }
    return `http://${input}:3000`;
  }, []);

  const nearbyBars = useMemo(() => bars.filter(b => nearbyIds.includes(b.id)), [bars, nearbyIds]);
  const selectedBar = useMemo(() => bars.find(b => b.id === selectedId), [bars, selectedId]);

  useEffect(() => {
    let locationSubscription = null;

    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@server_url');
        if (saved) {
          setServerUrl(saved);
          setTempIp(saved);
          fetchBars(saved);
        } else {
          const oldIp = await AsyncStorage.getItem('@server_ip');
          if (oldIp) {
            await AsyncStorage.setItem('@server_url', oldIp);
            await AsyncStorage.removeItem('@server_ip');
            setServerUrl(oldIp);
            setTempIp(oldIp);
            fetchBars(oldIp);
          }
        }

        const savedVotes = await AsyncStorage.getItem('@user_votes');
        if (savedVotes) {
          setUserVotes(JSON.parse(savedVotes));
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("GPS", "GeoBar requiere permisos de ubicación.");
          return setLoading(false);
        }

        // Seguimiento constante de la persona (Real-time tracking)
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 2000, // Cada 2 segundos
            distanceInterval: 5  // O cada 5 metros
          },
          (loc) => {
            console.log("Nueva ubicación:", loc.coords.latitude, loc.coords.longitude);
            setLocation(loc.coords);
          }
        );

      } catch (e) {
        console.warn("GPS Error", e);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const fetchBars = async (target) => {
    const url = normalizeUrl(target);
    if (!url) return;
    try {
      const response = await fetch(`${url}/bars`);
      if (response.ok) {
        const data = await response.json();
        setBars(data);
      }
    } catch (e) {
      console.log("No se pudo sincronizar bares con el servidor.");
    }
  };

  const testConnection = async (input) => {
    const url = normalizeUrl(input);
    if (!url) {
      setConnectionStatus('unknown');
      return;
    }
    setIsChecking(true);
    setConnectionStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${url}/bars`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('failed');
      }
    } catch (e) {
      setConnectionStatus('failed');
    } finally {
      setIsChecking(false);
    }
  };

  // --- MOTOR DE AUTO-RESET (12 HORAS) + SINCRONIZACIÓN LIVE ---
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const NOW = Date.now();
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;
      setBars(currentBars => {
        let changed = false;
        const newBars = currentBars.map(bar => {
          if (bar.lastUpdated && (NOW - bar.lastUpdated > TWELVE_HOURS)) {
            changed = true;
            return { ...bar, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null };
          }
          return bar;
        });
        return changed ? newBars : currentBars;
      });
    }, 60000);

    const syncInterval = setInterval(async () => {
      if (serverUrl) {
        fetchBars(serverUrl);
        try {
          const base = normalizeUrl(serverUrl);
          if (base) {
            const resetResp = await fetch(`${base}/user-reset-timestamp`);
            if (resetResp.ok) {
              const { timestamp } = await resetResp.json();
              const storedReset = await AsyncStorage.getItem('@user_reset_timestamp');
              if (storedReset && timestamp.toString() !== storedReset) {
                await AsyncStorage.removeItem('@user_votes');
                await AsyncStorage.setItem('@user_reset_timestamp', timestamp.toString());
                setUserVotes({});
              } else if (!storedReset) {
                await AsyncStorage.setItem('@user_reset_timestamp', timestamp.toString());
              }
            }
          }
        } catch (e) {}
      }
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(syncInterval);
    };
  }, [serverUrl]);

  const lastInjectedBars = useRef("");
  useEffect(() => {
    if (webViewRef.current && !loading) {
      const barsStr = JSON.stringify(bars);
      if (lastInjectedBars.current !== barsStr) {
        lastInjectedBars.current = barsStr;
        webViewRef.current.injectJavaScript(`window.renderBars(${barsStr})`);
      }
    }
  }, [bars, loading]);

  const onMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'MAP_MOVE' && isSimulated) {
        const { lat, lon } = msg.center;
        const freshNearby = [];
        const limit = 0.003;
        for (let i = 0; i < bars.length; i++) {
          const b = bars[i];
          if (Math.abs(b.lat - lat) < limit && Math.abs(b.lon - lon) < limit) {
            freshNearby.push(b.id);
          }
        }
        setNearbyIds(prev => JSON.stringify(prev) === JSON.stringify(freshNearby) ? prev : freshNearby);
      }
    } catch (e) { }
  }, [bars, isSimulated]);

  useEffect(() => {
    if (nearbyIds.length === 1) setSelectedId(nearbyIds[0]);
    else if (nearbyIds.length === 0) setSelectedId(null);
  }, [nearbyIds]);

  const confirmVote = useCallback(async () => {
    if (!pendingVote) return;
    const { type, previousVote } = pendingVote;

    setIsSyncing(true);

    const newUserVotes = { ...userVotes, [selectedId]: type };
    setUserVotes(newUserVotes);
    AsyncStorage.setItem('@user_votes', JSON.stringify(newUserVotes));

    const voteChange = { [type]: 1, ...(previousVote ? { [previousVote]: -1 } : {}) };

    setBars(currentBars => currentBars.map(bar => {
      if (bar.id === selectedId) {
        return {
          ...bar,
          votes: {
            prendido: bar.votes.prendido + (voteChange.prendido || 0),
            vengan: bar.votes.vengan + (voteChange.vengan || 0),
            paja: bar.votes.paja + (voteChange.paja || 0)
          },
          lastUpdated: Date.now()
        };
      }
      return bar;
    }));

    const baseUrl = normalizeUrl(serverUrl);
    if (baseUrl) {
      try {
        if (previousVote) {
          await fetch(`${baseUrl}/removevote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ barId: selectedId, type: previousVote })
          });
        }
        const response = await fetch(`${baseUrl}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barId: selectedId, type })
        });
        if (!response.ok) throw new Error("Sync failed");
      } catch (e) {
        console.warn("Fallo de sincronización remota");
      }
    }

    setPendingVote(null);
    setVoteCountdown(0);
    setIsSyncing(false);
    confirmingVoteRef.current = false;
  }, [pendingVote, selectedId, serverUrl, userVotes]);

  const cancelVote = useCallback(() => {
    setPendingVote(null);
    setVoteCountdown(0);
    setIsSyncing(false);
    confirmingVoteRef.current = false;
  }, []);

  const sendStatus = useCallback((type) => {
    if (!selectedId || pendingVote || confirmingVoteRef.current) return;

    const currentVote = userVotes[selectedId];
    if (currentVote === type) return;

    confirmingVoteRef.current = true;
    const previousVote = currentVote || null;
    setPendingVote({ type, previousVote });
    setVoteCountdown(3);
    setIsSyncing(true);
  }, [selectedId, userVotes, pendingVote]);

  useEffect(() => {
    if (pendingVote && voteCountdown > 0) {
      const timer = setTimeout(() => {
        setVoteCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (pendingVote && voteCountdown === 0 && confirmingVoteRef.current) {
      confirmVote();
    }
  }, [pendingVote, voteCountdown, confirmVote]);

  const mapHTML = useMemo(() => {
    return getLeafletHTML(location?.latitude || -33.4385, location?.longitude || -70.6405);
  }, [location?.latitude, location?.longitude]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          key="geobar-main-map"
          androidLayerType="hardware"
          source={{ html: mapHTML }}
          onMessage={onMessage}
          style={styles.map}
          cacheEnabled={true}
          domStorageEnabled={true}
          onLoadEnd={() => webViewRef.current?.injectJavaScript(`window.renderBars(${JSON.stringify(bars)})`)}
        />
      </View>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header}>
          <View>
            <Text style={styles.brandText}>GEOBAR</Text>
            <TouchableOpacity
              onLongPress={() => {
                setTempIp(serverUrl);
                setIsNetworkModalVisible(true);
              }}
              delayLongPress={2000}
              style={styles.badgeRow}
            >
              <Text style={styles.cityText}>SANTIAGO RM</Text>
              {isSimulated && <View style={styles.simBadge}><Text style={styles.simText}>SIMULACIÓN</Text></View>}
              {isSyncing && <ActivityIndicator size="small" color={COLORS.PRENDIDO} style={{ marginLeft: 5 }} />}
              {serverUrl ? <Globe size={10} color={COLORS.PRENDIDO} style={{ marginLeft: 5 }} /> : null}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.iconButton, isSimulated && { backgroundColor: COLORS.WINE_RED }]}
            onPress={() => setIsSimulated(!isSimulated)}
          >
            <Layers size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow} pointerEvents="box-none">
          <View style={styles.statusPanel} pointerEvents="auto">
            {nearbyBars.length > 0 ? (
              <View>
                {nearbyBars.length > 1 && !selectedBar && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selector}>
                    {nearbyBars.map(bar => (
                      <TouchableOpacity key={bar.id} style={styles.barChip} onPress={() => setSelectedId(bar.id)}>
                        <Text style={styles.chipText}>{bar.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
                {selectedBar && (
                  <View>
                    <View style={styles.selectedBarHeader}>
                      <View>
                        <Text style={styles.selectedBarName}>{selectedBar.name}</Text>
                        <Text style={styles.voteCount}>🔥 {selectedBar.votes.prendido} | 💣 {selectedBar.votes.vengan} | 💀 {selectedBar.votes.paja}</Text>
                      </View>
                      {nearbyBars.length > 1 && <TouchableOpacity onPress={() => setSelectedId(null)}><Text style={styles.changeText}>Cambiar</Text></TouchableOpacity>}
                    </View>
                    <View style={styles.buttonGrid}>
                      <TouchableOpacity
                        disabled={userVotes[selectedId] && !pendingVote}
                        style={[
                          styles.statusBtn,
                          { backgroundColor: COLORS.PRENDIDO },
                          (userVotes[selectedId] && !pendingVote) && { opacity: 0.5 },
                          userVotes[selectedId] === 'prendido' && styles.votedBtn,
                          pendingVote && pendingVote.type === 'prendido' && styles.votedBtn
                        ]}
                        onPress={() => sendStatus('prendido')}
                      >
                        <Flame size={16} color="#fff" />
                        <Text style={styles.btnText}>
                          {pendingVote && pendingVote.type === 'prendido' ? `Confirmando... (${voteCountdown})` :
                           userVotes[selectedId] === 'prendido' ? '✓ ¡Prendido!' :
                           userVotes[selectedId] ? 'Cambiar a prendido' : '¡Se Prendió!'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={userVotes[selectedId] && !pendingVote}
                        style={[
                          styles.statusBtn,
                          { backgroundColor: COLORS.VENGAN },
                          (userVotes[selectedId] && !pendingVote) && { opacity: 0.5 },
                          userVotes[selectedId] === 'vengan' && styles.votedBtn,
                          pendingVote && pendingVote.type === 'vengan' && styles.votedBtn
                        ]}
                        onPress={() => sendStatus('vengan')}
                      >
                        <TrendingUp size={16} color="#fff" />
                        <Text style={styles.btnText}>
                          {pendingVote && pendingVote.type === 'vengan' ? `Confirmando... (${voteCountdown})` :
                           userVotes[selectedId] === 'vengan' ? '✓ ¡Vengan!' :
                           userVotes[selectedId] ? 'Cambiar a vengan' : '¡Vengan ya!'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={userVotes[selectedId] && !pendingVote}
                        style={[
                          styles.statusBtn,
                          { backgroundColor: COLORS.PAJA },
                          (userVotes[selectedId] && !pendingVote) && { opacity: 0.5 },
                          userVotes[selectedId] === 'paja' && styles.votedBtn,
                          pendingVote && pendingVote.type === 'paja' && styles.votedBtn
                        ]}
                        onPress={() => sendStatus('paja')}
                      >
                        <Skull size={16} color="#fff" />
                        <Text style={styles.btnText}>
                          {pendingVote && pendingVote.type === 'paja' ? `Confirmando... (${voteCountdown})` :
                           userVotes[selectedId] === 'paja' ? '✓ ¡Paja!' :
                           userVotes[selectedId] ? 'Cambiar a paja' : 'Paja total'}
                        </Text>
                      </TouchableOpacity>
                      {pendingVote && (
                        <TouchableOpacity style={[styles.cancelBtn, { marginTop: 8 }]} onPress={cancelVote}>
                          <Text style={styles.cancelBtnText}>Cancelar ({voteCountdown}s)</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.emptyPanel}>
                <MessageSquare size={18} color="rgba(255,255,255,0.4)" />
                <Text style={styles.emptyText}>Explora la RM ({bars.length} bares)</Text>
              </View>
            )}
          </View>
          <View style={styles.rightControls}>
            <TouchableOpacity
              style={styles.fab}
              onPress={async () => {
                setIsSimulated(false);
                try {
                  let loc = await Location.getLastKnownPositionAsync({ maxAge: 60000 });
                  if (!loc) loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

                  const updateScript = `
                    window.updateLocation(${loc.coords.latitude}, ${loc.coords.longitude});
                    map.setView([${loc.coords.latitude}, ${loc.coords.longitude}], 16, { animate: false });
                  `;
                  webViewRef.current?.injectJavaScript(updateScript);
                } catch (e) {
                  Alert.alert("GPS", "No se pudo sincronizar la ubicación real.");
                }
              }}
            >
              <Navigation size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MODAL DE CONFIGURACIÓN DE RED (MODO RELEASE) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNetworkModalVisible}
        onRequestClose={() => setIsNetworkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configuración de Red</Text>
            <Text style={styles.modalSubtitle}>IP local (ej: 192.168.1.50) o URL del servidor (ej: https://tuservidor.onrender.com).</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.ipInput}
                placeholder="IP o URL del servidor"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={tempIp}
                onChangeText={(text) => {
                  setTempIp(text);
                  setConnectionStatus('unknown');
                }}
                keyboardType="url"
              />
              <TouchableOpacity
                style={[styles.testBtn, isChecking && { opacity: 0.5 }]}
                onPress={() => testConnection(tempIp)}
                disabled={isChecking}
              >
                {isChecking ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.testBtnText}>Test</Text>}
              </TouchableOpacity>
            </View>

            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot,
              connectionStatus === 'success' ? { backgroundColor: COLORS.PRENDIDO } :
                connectionStatus === 'failed' ? { backgroundColor: COLORS.PAJA } :
                  { backgroundColor: 'rgba(255,255,255,0.2)' }
              ]} />
              <Text style={[styles.statusInfo,
              connectionStatus === 'success' ? { color: COLORS.PRENDIDO } :
                connectionStatus === 'failed' ? { color: COLORS.PAJA } :
                  { color: 'rgba(255,255,255,0.4)' }
              ]}>
                {connectionStatus === 'success' ? "Servidor detectado correctamente" :
                  connectionStatus === 'failed' ? "No se pudo conectar al host" :
                    "Ingresa la IP y presiona Test"}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsNetworkModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={async () => {
                  try {
                    const displayUrl = normalizeUrl(tempIp) || tempIp || "ninguna";
                    await AsyncStorage.setItem('@server_url', tempIp);
                    setServerUrl(tempIp);
                    setIsNetworkModalVisible(false);
                    if (tempIp) fetchBars(tempIp);
                    Alert.alert("Conexión", tempIp ? `Sincronizando con ${displayUrl}` : "Modo local (sin sincronización)");
                  } catch (e) {
                    Alert.alert("Error", "No se pudo guardar la configuración.");
                  }
                }}
              >
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && <View style={styles.loadingOverlay}><ActivityIndicator size="large" color={COLORS.WINE_RED} /><Text style={styles.loadingText}>GeoBar está listo...</Text></View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.UI_BG },
  mapContainer: { flex: 1 },
  map: { width, height },
  overlay: { ...StyleSheet.absoluteFillObject, padding: 18, paddingTop: 50, justifyContent: 'space-between' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(35, 19, 31, 0.95)', padding: 15, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', elevation: 15
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  simBadge: { backgroundColor: COLORS.VENGAN, paddingHorizontal: 6, borderRadius: 4 },
  simText: { color: COLORS.UI_BG, fontSize: 8, fontWeight: '900' },
  brandText: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  cityText: { color: COLORS.WINE_RED, fontSize: 10, fontWeight: 'bold' },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statusPanel: {
    width: width * 0.65, backgroundColor: 'rgba(35, 19, 31, 0.95)',
    borderRadius: 25, padding: 18, borderLeftWidth: 4, borderLeftColor: COLORS.WINE_RED,
    shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 15, elevation: 25
  },
  selectedBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  selectedBarName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  voteCount: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4 },
  changeText: { color: COLORS.WINE_RED, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  buttonGrid: { gap: 8 },
  statusBtn: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center', gap: 10 },
  votedBtn: { borderWidth: 2, borderColor: '#fff' },
  cancelBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '700' },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  selector: { flexDirection: 'row', marginBottom: 10, height: 35 },
  barChip: { backgroundColor: COLORS.WINE_RED, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, marginRight: 8, height: 30 },
  chipText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyPanel: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  rightControls: { gap: 15 },
  fab: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.WINE_RED,
    justifyContent: 'center', alignItems: 'center', elevation: 12
  },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.UI_BG, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  loadingText: { color: '#fff', marginTop: 15, fontSize: 14, fontWeight: '500' },

  // ESTILOS MODAL RED
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: width * 0.85, bgcolor: COLORS.UI_BG, backgroundColor: COLORS.UI_BG,
    borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 30
  },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 10 },
  modalSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 20 },
  ipInput: {
    backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: 12, padding: 15,
    fontSize: 16, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  modalButtons: { flexDirection: 'row', gap: 10 },
  saveBtn: { backgroundColor: COLORS.WINE_RED },
  // NUEVOS ESTILOS STATUS RED
  inputContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  ipInput: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: 12, padding: 15,
    fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  testBtn: { backgroundColor: COLORS.WINE_RED, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 12 },
  testBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  statusIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 25, paddingHorizontal: 5 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusInfo: { fontSize: 11, fontWeight: 'bold' },
});
