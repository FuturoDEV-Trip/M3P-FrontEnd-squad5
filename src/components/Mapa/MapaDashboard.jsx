import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import getAddressFromCep from '../../service/addressService';
import styles from './MapaDashboard.module.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { MapPinCheckInside } from 'lucide-react';

const svgIcon = renderToString(<MapPinCheckInside color="#586fdf" />);
const base64Icon = `data:image/svg+xml;base64,${btoa(svgIcon)}`;

const customIcon = L.icon({
  iconUrl: base64Icon,
  iconSize: [38, 95],
  iconAnchor: null,
  popupAnchor: [0, 0],
});

function MapMarkers({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places.length > 0) {
      const firstPlace = places[0];
      map.flyTo([firstPlace.latitude, firstPlace.longitude], 13, { animate: true });
    }
  }, [places, map]);

  return (
    <>
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]} 
          icon={customIcon}
        >
          <Popup>
            <strong>{place.nome_destino}</strong>
            <p>{place.descricao_destino}</p>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

function MapaDashboard({ center = [-27.593500, -48.558540], zoom = 13 }) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:3000/');
        console.log('Resposta da API:', response.data);
        const destinos = response.data.destinos;
  
        const placesWithCoordinates = destinos.map((place) => {
          let latitude, longitude;
  
          if (place.coordenadas_destino) {
            const coordenadasArray = place.coordenadas_destino.split(',');
  
            if (coordenadasArray.length === 2) {
              latitude = parseFloat(coordenadasArray[0]);
              longitude = parseFloat(coordenadasArray[1]);
            }
          }
  
          return { 
            ...place, 
            latitude: latitude || -27.593500, 
            longitude: longitude ||  -48.558540 
          };
        });
  
        setPlaces(placesWithCoordinates);
      } catch (error) {
        console.error('Falha ao carregar informações do destino:', error); 
      }
    };
  
    fetchPlaces();
  }, []);

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      className={styles.mapContainer}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapMarkers places={places} />
    </MapContainer>
  );
};

export default MapaDashboard;