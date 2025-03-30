import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBSpinner
} from 'mdb-react-ui-kit';

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    status: ''
  });

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/user/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }

      const bookings = await response.json();
      const booking = bookings.find(b => b._id === id);
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      setFormData({
        date: new Date(booking.date).toISOString().split('T')[0],
        time: booking.time,
        status: booking.status
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update booking');
      }

      navigate('/user-dashboard/my-reservations');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <MDBContainer className="py-4">
      <MDBCard>
        <MDBCardBody>
          <h2 className="text-center mb-4">Edit Booking</h2>
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass="mb-4"
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />

            <MDBInput
              wrapperClass="mb-4"
              label="Time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              step="1800"
            />

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button
                color="secondary"
                className="btn btn-secondary"
                onClick={() => navigate('/user-dashboard/my-reservations')}
              >
                Cancel
              </button>
              <button
                type="submit"
                color="primary"
                className="btn btn-dark"
                disabled={loading}
              >
                {loading ? (
                  <MDBSpinner size="sm" role="status" tag="span" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </MDBSpinner>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default EditBooking;