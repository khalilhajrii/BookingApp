import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBSpinner
} from 'mdb-react-ui-kit';

function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    dateOfBirth: '',
    sexe: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/role/getAllRoles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
  
      const data = await response.json();
      setRoles(data.roles);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles. Please try again.');
    }
  };

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
      const response = await fetch(`http://localhost:8000/api/user/getuserByUserName/${username}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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

  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    setFormData({
      ...formData,
      password
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!formData.role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    const isUsernameAvailable = await checkUsername(formData.username);
    if (!isUsernameAvailable) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          sender: 'admin'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      setSuccessMessage('User created successfully! An email with credentials has been sent.');
      setFormData({
        name: '',
        lastname: '',
        dateOfBirth: '',
        sexe: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: ''
      });
      
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);

    } catch (err) {
      console.error('User creation error:', err);
      setError(err.message || 'An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="py-4">
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <MDBCard>
            <MDBCardBody>
              {successMessage && (
                <div className="alert alert-success mb-3" role="alert">
                  {successMessage}
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <MDBInput
                      id="name"
                      label="First Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <MDBInput
                      id="lastname"
                      label="Last Name"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <MDBInput
                      type="date"
                      id="dateOfBirth"
                      label="Date of Birth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <select
                      id="sexe"
                      className="form-select"
                      value={formData.sexe}
                      onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <MDBInput
                      id="username"
                      label="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                    {usernameError && (
                      <div className="text-danger small mt-1">{usernameError}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <MDBInput
                      type="email"
                      id="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group">
                    <MDBInput
                      type="password"
                      id="password"
                      label="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-75"
                    />
                    <button
                      color="secondary"
                      type="button"
                      onClick={generateRandomPassword}
                      className="ms-2 btn btn-secondary"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <MDBInput
                      id="phone"
                      label="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <MDBInput
                      id="address"
                      label="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <select
                    id="role"
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles && roles.map(role => (
                      <option key={role._id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    color="secondary"
                    type="button"
                    className='btn btn-secondary'
                    onClick={() => navigate('/admin-dashboard')}
                  >
                    Cancel
                  </button>
                  <button type="submit" color="primary" className='btn btn-dark' disabled={loading}>
                    {loading ? (
                      <>
                        <MDBSpinner size="sm" role="status" tag="span" />
                        <span className="ms-2">Creating...</span>
                      </>
                    ) : 'Create User'}
                  </button>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default AddUser; 