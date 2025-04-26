import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';
import NavBar from '../Components/NavBar';

function AccountActivation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('activating');
  const [error, setError] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/auth/activate/${token}`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Activation failed');
        }

        setStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    };

    activateAccount();
  }, [token, navigate]);

  return (
    <div>
      <NavBar />
      <MDBContainer className="mt-5">
        <MDBCard className='text-center'>
          <MDBCardBody>
            {status === 'activating' && (
              <>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Activating your account...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <MDBIcon fas icon="check-circle" size='3x' className='text-success mb-3' />
                <h2>Account Activated!</h2>
                <p>Your account has been successfully activated. Redirecting to login...</p>
                <MDBBtn color='primary' onClick={() => navigate('/')}>
                  Go to Login
                </MDBBtn>
              </>
            )}

            {status === 'error' && (
              <>
                <MDBIcon fas icon="times-circle" size='3x' className='text-danger mb-3' />
                <h2>Activation Failed</h2>
                <p>{error || 'There was an error activating your account.'}</p>
                <MDBBtn color='primary' onClick={() => navigate('/register')}>
                  Back to Registration
                </MDBBtn>
              </>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default AccountActivation; 