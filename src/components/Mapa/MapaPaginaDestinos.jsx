import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import getAddressFromCep from '../../service/addressService';
import styles from './MapaPaginaDestinos.module.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { MapPinCheckInside } from 'lucide-react';
import { useAuth } from '../../contexts/Auth';

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
    const defaultZoom = 13;
  
    if (places.length > 0) {
      const firstPlace = places[0];
      map.flyTo([firstPlace.latitude_destino, firstPlace.longitude_destino], defaultZoom, { animate: true });
    } else {
      map.setView([-27.593500, -48.558540], defaultZoom);
    }
  }, [places, map]);

  return (
    <>
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude_destino, place.longitude_destino]} 
          icon={customIcon}
        >
          <Popup>
          <div className={styles.popupContainer}>
            <strong className={styles.placeName}>{place.nome_destino}</strong>
            <p className={styles.placeDescription}>{place.descricao_destino}</p>
          </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

function MapaPaginaDestinos({ center = [-27.593500, -48.558540], zoom = 13 }) {
  const { token } = useAuth();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:3000/destinos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const placesWithCoordinates = await Promise.all(
          response.data.map(async (place) => {
            const addressData = await getAddressFromCep(place.cep_destino);
            return { ...place, ...addressData };
          })
        );
        setPlaces(placesWithCoordinates);
      } catch (error) {
        console.error('Falha ao carregar informações do destino:', error);
      }
    };

    if (token) {
      fetchPlaces();
    }
  }, [token]);

  return (
    places.length > 0 ? (
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
    ) : (
        <p>Carregando destinos...</p> 
    )
  );
};

export default MapaPaginaDestinos;