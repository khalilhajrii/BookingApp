import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBContainer
} from 'mdb-react-ui-kit';

const MyReservations = () => {
  return (
    <MDBContainer className="py-4">
      <h2 className="mb-4">My Reservations</h2>
      <MDBCard>
        <MDBCardBody>
          {/* Reservations list will go here */}
          <p>Your reservations will appear here...</p>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default MyReservations; 