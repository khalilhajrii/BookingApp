import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBSpinner,
    MDBBadge,
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput,
    MDBSelect,
    MDBInputGroup
} from 'mdb-react-ui-kit';
import NavBar from '../../Components/NavBar';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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
    const [roles, setRoles] = useState(null); 

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, users]);

    const filterUsers = () => {
        if (!searchTerm) {
            setFilteredUsers(users);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        const results = users.filter(user => {
            return (
                (user.username && user.username.toLowerCase().includes(lowercasedTerm)) ||
                (user.name && user.name.toLowerCase().includes(lowercasedTerm)) ||
                (user.lastname && user.lastname.toLowerCase().includes(lowercasedTerm)) ||
                (user.email && user.email.toLowerCase().includes(lowercasedTerm)) ||
                (user.phone && user.phone.includes(lowercasedTerm)) ||
                (user.role && user.role.name && user.role.name.toLowerCase().includes(lowercasedTerm))
            );
        });

        setFilteredUsers(results);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/getAllusers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            const usersData = data.users || [];
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (err) {
            setError(err.message);
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
          setRoles(data.roles);
        } catch (err) {
          console.error('Error fetching roles:', err);
          setRoles([]);
        }
      };

    const handleAdd = () => {
        setSelectedUser(null);
        setFormData({
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
        setModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            name: user.name,
            lastname: user.lastname,
            phone: user.phone,
            role: user.role._id,
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
            sexe: user.sexe || ''
        });
        setModalOpen(true);
    };

    const handleDelete = async (user) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/user/deleteUser/${user._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }

                fetchUsers();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedUser
                ? `http://localhost:8000/api/user/updateUser/${selectedUser._id}`
                : 'http://localhost:8000/api/user/register';

            const method = selectedUser ? 'PUT' : 'POST';

            const requestData = selectedUser 
                ? { 
                    ...formData,
                    ...(formData.password ? {} : { password: undefined })
                  } 
                : { ...formData, sender: 'admin' };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(selectedUser ? 'Failed to update user' : 'Failed to create user');
            }

            setError('');
            const successMsg = selectedUser 
                ? (formData.password 
                    ? 'User updated successfully. A new password notification has been sent.' 
                    : 'User updated successfully.')
                : 'User created successfully!';
                
            const tempMsg = document.createElement('div');
            tempMsg.className = 'alert alert-success';
            tempMsg.innerHTML = successMsg;
            document.querySelector('.alert-container')?.appendChild(tempMsg);
            
            setTimeout(() => {
                tempMsg.remove();
            }, 3000);

            setModalOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.message);
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

    const columns = [
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Name',
            selector: row => `${row.name} ${row.lastname}`,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Phone',
            selector: row => row.phone || 'N/A',
            sortable: true
        },
        {
            name: 'Role',
            cell: row => (
                <MDBBadge color={
                    row.role.name === 'admin' ? 'danger' :
                        row.role.name === 'barber' ? 'primary' : 'success'
                }>
                    {row.role.name}
                </MDBBadge>
            ),
            sortable: true
        },
        {
            name: 'Actions',
            width: '200px',
            cell: row => (
                <div className="d-flex gap-1">
                    <Link to={`/admin-dashboard/update-user/${row._id}`}>
                        <button
                            type="button"
                            className="btn btn-primary rounded-3 py-1 px-2"
                            style={{ fontSize: '0.875rem' }}
                        >
                            Edit
                        </button>
                    </Link>
                    <button
                        type="button"
                        className="btn btn-danger rounded-3 py-1 px-2"
                        style={{ fontSize: '0.875rem' }}
                        onClick={() => handleDelete(row)}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <MDBSpinner role="status">
                    <span className="visually-hidden">Loading...</span>
                </MDBSpinner>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
        <MDBContainer className="py-4">
            <MDBCard>
                <MDBCardBody>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>User Management</h2>
                        <Link to="/admin-dashboard/add-user">
                            <MDBBtn className="btn-success">
                                Add User
                            </MDBBtn>
                        </Link>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    <div className="alert-container">
                        {/* Success alerts will be added here dynamically */}
                    </div>

                    <div className="mb-4">
                        <MDBInputGroup>
                            <MDBInput
                                placeholder="Search by name, username, email, role..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </MDBInputGroup>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 25, 50]}
                        responsive
                        striped
                        highlightOnHover
                        noDataComponent={
                            <div className="text-center py-4">
                                {searchTerm ? "No users found matching your search" : "No users available"}
                            </div>
                        }
                    />
                </MDBCardBody>
            </MDBCard>

            <MDBModal show={modalOpen} onHide={() => setModalOpen(false)} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <form onSubmit={handleSubmit}>
                            <MDBModalHeader>
                                <MDBModalTitle>{selectedUser ? 'Edit User' : 'Add User'}</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={() => setModalOpen(false)}></MDBBtn>
                            </MDBModalHeader>

                            <MDBModalBody>
                                <div className="mb-3">
                                    <MDBInput
                                        label='Username'
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <MDBInput
                                        type='email'
                                        label='Email'
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <MDBInput
                                            type='password'
                                            label='Password'
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required={!selectedUser}
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
                                    {selectedUser && (
                                        <small className="text-muted">
                                            Leave empty to keep the current password. If changed, the user will be notified.
                                        </small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <MDBInput
                                        label='Name'
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <MDBInput
                                        label='Last Name'
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <MDBInput
                                        label='Phone'
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <MDBInput
                                        type='date'
                                        label='Date of Birth'
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <select
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
                                <div className="mb-3">
                                    <select
                                        className="form-select"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        {roles && roles.map(role => (
                                            <option key={role._id} value={role._id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </MDBModalBody>

                            <MDBModalFooter>
                                <MDBBtn type="button" color='secondary' onClick={() => setModalOpen(false)}>
                                    Close
                                </MDBBtn>
                                <MDBBtn type="submit" color='primary'>
                                    {selectedUser ? 'Update' : 'Create'}
                                </MDBBtn>
                            </MDBModalFooter>
                        </form>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer>
        </div>
    );
};

export default UserManagement; 