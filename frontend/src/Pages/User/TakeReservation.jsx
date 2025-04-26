import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import BookingForm from '../../Components/BookingForm';
import BookingCalendar from '../../Components/BookingCalendar';
import NavBar from '../../Components/NavBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TakeReservation = () => {
  const { barberid } = useParams();
  const [barberAddress, setBarberAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchBarberAddress = async () => {
      console.log('Fetching barber address...');
      try {
        const response = await fetch(`http://localhost:8000/api/user/getuserById/${barberid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('API Response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch barber address');
        }
        const data = await response.json();
        console.log('Barber Data:', data.user.address); 
        setBarberAddress(data.user.address);
      } catch (error) {
        console.error('Error fetching barber address:', error);
      }
    };

    if (barberid) {
      console.log('Barber ID is available:', barberid);
      fetchBarberAddress();
    }
  }, [barberid]);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!barberAddress) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(barberAddress)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const location = data[0];
          setCoordinates({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
        } else {
          console.error('Geocoding failed:', data);
        }
      } catch (error) {
        console.error('Error fetching geocoding data:', error);
      }
    };

    geocodeAddress();
  }, [barberAddress]);

  return (
    <div>
      <NavBar />
      <MDBContainer className="py-4">
        <MDBRow>
          <MDBCol md="6">
            <BookingForm />
          </MDBCol>
          <MDBCol md="6">
            <BookingCalendar />
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-4">
          <MDBCol>
            <h4>Barber Location</h4>
            {coordinates ? (
              <MapContainer
                center={coordinates}
                zoom={15}
                style={{ width: '100%', height: '400px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={coordinates}>
                  <Popup>{barberAddress}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>Loading map...</p>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default TakeReservation;