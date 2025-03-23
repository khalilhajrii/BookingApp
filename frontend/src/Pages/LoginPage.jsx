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
import { jwtDecode } from 'jwt-decode';
import Footer from '../Components/Footer';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.type]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: "67d49e97eaed80cbda5dff9a",
          username: formData.email.split('@')[0]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      // Decode token to get role (you might need a JWT decode library)
      const decodedToken = jwtDecode(data.token);
      const userRole = decodedToken.role.name;
      
      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'user') {
        navigate('/user-dashboard');
      }

    } catch (err) {
      setError(err.message || 'An error occurred during login');
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
                Welcome Back <br />
                <span className="text-primary">Ready for Your Next Fresh Cut? </span>
              </h1>
            </MDBCol>

            <MDBCol md='6'>
              <MDBCard className='my-5'>
                <MDBCardBody className='p-5'>
                  <form onSubmit={handleSubmit}>
                    <MDBInput 
                      wrapperClass='mb-4' 
                      label='Email' 
                      type='email' 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <MDBInput 
                      wrapperClass='mb-4' 
                      label='Password' 
                      type='password'
                      value={formData.password}
                      onChange={handleInputChange}
                    />

                    {error && (
                      <div className="text-danger mb-3">
                        {error}
                      </div>
                    )}

                    <MDBBtn 
                      type='submit'
                      className='w-100 mb-4' 
                      size='md' 
                      color='dark'
                    >
                      sign in
                    </MDBBtn>

                    <div className="text-center">
                      <p>Don't have an account? <a href="/register" className="text-primary">Sign up</a></p>
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

export default LoginPage; 