import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBSpinner
} from 'mdb-react-ui-kit';

const BookingForm = () => {
  const { barberid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format the date to ISO string
      const formattedDate = new Date(formData.date).toISOString();
      
      const response = await fetch('http://localhost:8000/api/bookings/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          barberId: barberid,
          date: formattedDate,
          time: formData.time
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      // Redirect to user dashboard after successful booking
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="py-4">
      <MDBCard>
        <MDBCardBody>
          <h2 className="text-center mb-4">Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput
                  wrapperClass="mb-4"
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput
                  wrapperClass="mb-4"
                  label="Time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  step="1800" // 30-minute intervals
                />
              </MDBCol>
            </MDBRow>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block mb-4"
              >
                {loading ? (
                  <MDBSpinner size="sm" role="status" tag="span" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </MDBSpinner>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default BookingForm; 