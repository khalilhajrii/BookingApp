import React from 'react';
import NavBar from '../Components/NavBar';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCheckbox
}
from 'mdb-react-ui-kit';

function RegisterPage() {
  return (
    <div>
      <NavBar/>
    <div className='container'>
    <MDBContainer fluid className='p-4'>

    <MDBRow>

      <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

        <h1 className="my-5 display-3 fw-bold ls-tight px-3">
        Book <br />
          <span className="text-primary">Your Fresh Cut at the Best Price! </span>
        </h1>


      </MDBCol>

      <MDBCol md='6'>

        <MDBCard className='my-5'>
          <MDBCardBody className='p-5'>

            <MDBRow>
              <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text'/>
              </MDBCol>

              <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='Last name' id='form1' type='text'/>
              </MDBCol>
            </MDBRow>

            <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email'/>
            <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password'/>

            <MDBBtn className='w-100 mb-4' size='md' color='dark'>sign up</MDBBtn>

            <div className="text-center">
              <p>Already have an account? <a href="/login" className="text-primary">Sign in</a></p>
            </div>

          </MDBCardBody>
        </MDBCard>

      </MDBCol>

    </MDBRow>

  </MDBContainer>
  </div>
  </div>
  );
}

export default RegisterPage;