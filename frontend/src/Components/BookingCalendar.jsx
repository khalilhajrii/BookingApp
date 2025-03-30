import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
  MDBBadge,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

const BookingCalendar = () => {
  const { barberid } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/bookings/barber/${barberid}/bookings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [barberid]);

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date }) => {
    const dayBookings = getBookingsForDate(date);
    if (dayBookings.length === 0) return null;

    return (
      <div className="booking-dots">
        {dayBookings.map(booking => (
          <div
            key={booking._id}
            className={`booking-dot ${booking.status}`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger'
    };
    return (
      <MDBBadge color={statusColors[status]} className="ms-2">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </MDBBadge>
    );
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
          <h2 className="text-center mb-4">Booking Calendar</h2>
          <MDBRow>
            <MDBCol md="8">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                className="w-100"
                minDate={new Date()}
                fullWidth
              />
            </MDBCol>
            <MDBCol md="4">
              <div className="booking-legend">
                <h4 className="mb-3">Bookings for {selectedDate.toLocaleDateString()}</h4>
                {getBookingsForDate(selectedDate).map(booking => (
                  <div key={booking._id} className="booking-item mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{booking.time}</span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <small className="text-muted">
                      Client: {booking.user.username}
                    </small>
                  </div>
                ))}
                {getBookingsForDate(selectedDate).length === 0 && (
                  <p className="text-muted">No bookings for this date</p>
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>

      <style>
        {`
          .booking-dots {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
            padding: 2px;
          }
          .booking-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .booking-dot.confirmed {
            background-color: #28a745;
          }
          .booking-dot.pending {
            background-color: #ffc107;
          }
          .booking-dot.cancelled {
            background-color: #dc3545;
          }
          .booking-item {
            padding: 8px;
            border-radius: 4px;
            background-color: #f8f9fa;
          }
          .booking-legend {
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
          }
          .react-calendar {
            border: none;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 8px;
          }
          .react-calendar__tile {
            padding: 1em 0.5em;
          }
        `}
      </style>
    </MDBContainer>
  );
};

export default BookingCalendar; 