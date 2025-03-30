import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import BookingForm from '../../Components/BookingForm';
import BookingCalendar from '../../Components/BookingCalendar';

const TakeReservation = () => {

  return (
    <MDBContainer className="py-4">
      <MDBRow>
        <MDBCol md="6">
          <BookingForm />
        </MDBCol>
        <MDBCol md="6">
          <BookingCalendar />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default TakeReservation; 