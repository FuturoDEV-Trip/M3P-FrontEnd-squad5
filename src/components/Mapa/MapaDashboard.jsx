import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { fetchPlaces, fetchUsers } from '../../service/dashboardService';
import styles from './MapaDashboard.module.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { MapPinCheckInside } from 'lucide-react';

const createCustomIcon = () => {
  const svgIcon = renderToString(<MapPinCheckInside color="#586fdf" />);
  const base64Icon = `data:image/svg+xml;base64,${btoa(svgIcon)}`;
  return L.icon({
    iconUrl: base64Icon,
    iconSize: [38, 95],
    iconAnchor: [19, 47], 
    popupAnchor: [0, -47], 
  });
};

function MapMarkers({ places, users }) {
  const map = useMap();
  const customIcon = createCustomIcon();

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
      {places.map((place) => {
        const user = users.find((u) => u.id === place.id_usuario);
        return (
          <Marker 
            key={place.id}
            position={[place.latitude_destino, place.longitude_destino]}
            icon={customIcon}
          >
            <Popup>
            <div className={styles.popupContainer}>
              <strong className={styles.placeName}>{place.nome_destino}</strong>
              <p className={styles.placeDescription}>{place.descricao_destino}</p>
              <small className={styles.placeUser}>Guia: {user?.nome_usuario || 'Admin'}</small>
            </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

function MapaDashboard({ center = [-27.593500, -48.558540], zoom = 13 }) {
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const placesData = await fetchPlaces();
        const usersData = await fetchUsers();
        setPlaces(placesData);
        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

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
        <MapMarkers places={places} users={users} />
      </MapContainer>
    ) : (
      <p>Carregando destinos...</p> 
    )
  );
};

export default MapaDashboard;
