import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
  MDBBtn,
  MDBBadge
} from 'mdb-react-ui-kit';

const MyReservations = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/bookings/user/bookings', {
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

  const handleEdit = (booking) => {
    navigate(`/user-dashboard/edit-booking/${booking._id}`);
  };

  const handleDelete = async (booking) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/bookings/booking/${booking._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete booking');
        }

        fetchBookings();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCancel = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/bookings/bookings/${booking._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: 'cancelled'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to cancel booking');
        }

        fetchBookings();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const columns = [
    {
      name: 'Barber',
      selector: row => row.barber.username,
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
        <MDBBadge color={
          row.status === 'confirmed' ? 'success' :
          row.status === 'pending' ? 'warning' : 'danger'
        }>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </MDBBadge>
      ),
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          {row.status !== 'cancelled' && (
            <>
              <button
                color="primary"
                size="sm"
                className="me-2 btn btn-primary"
                onClick={() => handleEdit(row)}
              >
                Edit
              </button>
              <button
                color="danger"
                size="sm"
                className="me-2 btn btn-danger"
                onClick={() => handleDelete(row)}
              >
                Delete
              </button>
              <button
                color="warning"
                size="sm"
                className="btn btn-warning"
                onClick={() => handleCancel(row)}
              >
                Cancel
              </button>
            </>
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
          <h2 className="text-center mb-4">My Reservations</h2>
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
  );
};

export default MyReservations;