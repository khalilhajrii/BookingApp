import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBSpinner,
  MDBAlert
} from 'mdb-react-ui-kit';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    lastname: '',
    phone: '',
    role: '',
    dateOfBirth: '',
    sexe: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/user/getuserById/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      const userData = data.user;
      
      if (!userData) {
        throw new Error('User not found');
      }

      setOriginalData(userData);
      
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        name: userData.name || '',
        lastname: userData.lastname || '',
        phone: userData.phone || '',
        role: userData.role?._id || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        sexe: userData.sexe || ''
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

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
      setRoles(data.roles || []);
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
    if (username === originalData.username) {
      return true;
    }

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
    setSuccess('');
    setLoading(true);

    if (formData.username !== originalData.username) {
      const isUsernameAvailable = await checkUsername(formData.username);
      if (!isUsernameAvailable) {
        setLoading(false);
        return;
      }
    }

    try {
      const requestData = {
        ...formData
      };

      if (!formData.password.trim()) {
        delete requestData.password;
      }

      const response = await fetch(`http://localhost:8000/api/user/updateUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      let successMessage = 'User updated successfully.';
      if (formData.email !== originalData.email) {
        successMessage += ' Email change notification has been sent.';
      }
      if (formData.password.trim()) {
        successMessage += ' Password change notification has been sent.';
      }
      
      setSuccess(successMessage);
      
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 3000);
    } catch (err) {
      console.error('User update error:', err);
      setError(err.message || 'An error occurred while updating the user');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.username) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  return (
    <MDBContainer className="py-4">
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <MDBCard>
            <MDBCardBody>
              {success && (
                <div className="alert alert-success mb-3" role="alert">
                  {success}
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
                    {formData.email !== originalData.email && (
                      <div className="text-warning small mt-1">
                        Email will be changed. Notification will be sent.
                      </div>
                    )}
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
                      className="w-75"
                    />
                    <MDBBtn
                      color="secondary"
                      type="button"
                      onClick={generateRandomPassword}
                      className="ms-2"
                    >
                      Generate
                    </MDBBtn>
                  </div>
                  <small className="text-muted">
                    Leave empty to keep the current password. If changed, the user will be notified.
                  </small>
                </div>

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
                      <option value="other">Other</option>
                    </select>
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
                    <select
                      id="role"
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    color="secondary"
                    className='btn btn-secondary'
                    type="button"
                    onClick={() => navigate('/admin-dashboard')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-dark"color="primary" disabled={loading}>
                    {loading ? (
                      <>
                        <MDBSpinner size="sm" role="status" tag="span" />
                        <span className="ms-2">Updating...</span>
                      </>
                    ) : 'Update User'}
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

export default UpdateUser; 