import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
  MDBBadge,
  MDBBtn,
  MDBAlert,
  MDBIcon
} from 'mdb-react-ui-kit';
import NavBar from '../../Components/NavBar';

const BarberReservations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/bookings/barber/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      const data = await response.json();
      console.log('Bookings data:', data);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          sender: 'barber'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const columns = [
    {
      name: 'Client Name',
      selector: row => `${row.user.name} ${row.user.lastname}`,
      sortable: true
    },
    {
      name: 'Client Email',
      selector: row => row.user.email,
      sortable: true
    },
    {
      name: 'Client Phone',
      selector: row => row.user.phone,
      sortable: true
    },
    {
      name: 'Date',
      selector: row => new Date(row.date).toLocaleDateString(),
      sortable: true
    },
    {
      name: 'Time',
      selector: row => row.time,
      sortable: true
    },
    {
      name: 'Status',
      cell: row => (
        <MDBBadge color={getStatusColor(row.status)}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </MDBBadge>
      ),
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-1">
          {row.status === 'pending' && (
            <>
              <button
                type="button"
                className="btn btn-success btn-sm py-1 px-2"
                onClick={() => handleStatusUpdate(row._id, 'confirmed')}
              >
                Confirm
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm py-1 px-2"
                onClick={() => handleStatusUpdate(row._id, 'rejected')}
              >
                Reject
              </button>
            </>
          )}
          {row.status === 'confirmed' && (
            <button
              type="button"
              className="btn btn-warning btn-sm py-1 px-2"
              onClick={() => handleStatusUpdate(row._id, 'cancelled')}
            >
              Cancel
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }


  return (
    <div>
      <NavBar />
    <MDBContainer className="py-4">
      <MDBCard>
        <MDBCardBody>
          <h2 className="text-center mb-4">Manage Reservations</h2>
          <DataTable
            columns={columns}
            data={bookings}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50]}
            responsive
            striped
            highlightOnHover
          />
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
    </div>
  );
};

export default BarberReservations; 