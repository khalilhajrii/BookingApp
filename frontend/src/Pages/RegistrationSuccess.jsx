import React from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBIcon
} from 'mdb-react-ui-kit';
import NavBar from '../Components/NavBar';

function RegistrationSuccess() {
  return (
    <div>
      <NavBar />
      <MDBContainer className="mt-5">
        <MDBCard className='text-center'>
          <MDBCardBody>
            <MDBIcon far icon="envelope" size='3x' className='text-primary mb-3' />
            <h2>Registration Successful!</h2>
            <p>
              We've sent you an email with a confirmation link. 
              Please check your inbox and click the link to activate your account.
            </p>
            <p className="small text-muted">
              If you don't see the email, please check your spam folder.
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default RegistrationSuccess; 