import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBCardBody
} from 'mdb-react-ui-kit';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    if (id === 'username') {
      setUsernameError('');
    }
  };

  const checkUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:8000/api/user/getuserByUserName/${username}`);
      const data = await response.json();
      
      if (response.ok && data.message === "Duplicated username") {
        setUsernameError('This username is already taken');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error checking username:', err);
      return true; 
    }
  };

  const sendActivationEmail = async (email, activationToken) => {
    try {
      const activationLink = `http://localhost:3000/activate/${activationToken}`;
  
      const response = await fetch('http://localhost:8000/api/notifications/sendActivationLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Activate Your Account',
          activationLink: activationLink, 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send activation email');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send activation email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const isUsernameAvailable = await checkUsername(formData.username);
    if (!isUsernameAvailable) {
      return;
    }

    try {
      const registerResponse = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "67d49e97eaed80cbda5dff9a"
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Registration failed');
      }

      if (registerData.user && registerData.user.activationToken) {
        await sendActivationEmail(formData.email, registerData.user.activationToken);
      } else {
        throw new Error('No activation token received');
      }

      setSuccessMessage('Registration successful! Please check your email to activate your account.');
      setTimeout(() => {
        navigate('/registration-success');
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    }
  };

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
                  <form onSubmit={handleSubmit}>
                    <MDBRow>
                      <MDBCol col='6'>
                        <MDBInput 
                          wrapperClass='mb-4' 
                          label='First name' 
                          id='firstName' 
                          type='text'
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </MDBCol>

                      <MDBCol col='6'>
                        <MDBInput 
                          wrapperClass='mb-4' 
                          label='Last name' 
                          id='lastName' 
                          type='text'
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </MDBCol>
                    </MDBRow>

                    <MDBInput 
                      wrapperClass='mb-4' 
                      label='Username' 
                      id='username' 
                      type='text'
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {usernameError && (
                      <div className="text-danger mb-3 small">
                        {usernameError}
                      </div>
                    )}

                    <MDBInput 
                      wrapperClass='mb-4' 
                      label='Email' 
                      id='email' 
                      type='email'
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <MDBInput 
                      wrapperClass='mb-4' 
                      label='Password' 
                      id='password' 
                      type='password'
                      value={formData.password}
                      onChange={handleInputChange}
                    />

                    {error && (
                      <div className="text-danger mb-3">
                        {error}
                      </div>
                    )}

                    {successMessage && (
                      <div className="text-success mb-3">
                        {successMessage}
                      </div>
                    )}

                    <MDBBtn 
                      type='submit' 
                      className='w-100 mb-4' 
                      size='md' 
                      color='dark'
                      disabled={!!usernameError}
                    >
                      sign up
                    </MDBBtn>

                    <div className="text-center">
                      <p>Already have an account? <a href="/login" className="text-primary">Sign in</a></p>
                    </div>
                  </form>
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