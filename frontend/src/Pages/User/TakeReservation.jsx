import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import BookingForm from '../../Components/BookingForm';
import BookingCalendar from '../../Components/BookingCalendar';
import NavBar from '../../Components/NavBar';

const TakeReservation = () => {

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
      </MDBContainer>
    </div>
  );
};

export default TakeReservation; 