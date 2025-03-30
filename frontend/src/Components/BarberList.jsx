import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBSpinner
} from 'mdb-react-ui-kit';

const BarberList = () => {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/bookings/bookings/allBarbers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch barbers');
        }

        const data = await response.json();
        console.log('Barbers data:', data);
        setBarbers(data || []);
      } catch (err) {
        console.error('Error fetching barbers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  const handleBookClick = (barberId) => {
    navigate(`/user-dashboard/take-reservation/${barberId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  if (error) {
    return (
      <MDBContainer className="mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="mt-4">
      <h2 className="mb-4">Available Barbers</h2>
      <MDBRow>
        {barbers && barbers.length > 0 ? (
          barbers.map((barber) => (
            <MDBCol key={barber._id} md="4" className="mb-4">
              <MDBCard style={{ width: '18rem' }}>
                <img
                  src="https://mdbcdn.b-cdn.net/img/new/standard/nature/182.webp"
                  className="card-img-top"
                  alt="Barber"
                />
                <MDBCardBody>
                  <MDBCardTitle>{barber.username}</MDBCardTitle>
                  <MDBCardText>
                    <strong>Email:</strong> {barber.email}<br />
                    <strong>Name:</strong> {barber.name || 'Not provided'}<br />
                    <strong>Phone:</strong> {barber.phone || 'Not provided'}<br />
                    <strong>Address:</strong> {barber.address || 'Not provided'}<br />
                  </MDBCardText>
                  <button 
                    color='dark' 
                    onClick={() => handleBookClick(barber._id)}
                    className="w-100 btn btn-dark"
                  >
                    Book Now
                  </button>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        ) : (
          <MDBCol>
            <div className="alert alert-info" role="alert">
              No barbers available at the moment.
            </div>
          </MDBCol>
        )}
      </MDBRow>
    </MDBContainer>
  );
};

export default BarberList; 