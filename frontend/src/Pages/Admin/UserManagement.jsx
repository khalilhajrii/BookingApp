import React, { useState, useEffect } from 'react';
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
    MDBSelect
} from 'mdb-react-ui-kit';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        lastname: '',
        phone: '',
        role: ''
    });
    const [roles, setRoles] = useState(null); 

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

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
            setUsers(data);
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
            role: ''
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
            role: user.role._id
        });
        setModalOpen(true);
    };

    const handleDelete = async (user) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${user._id}`, {
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
                ? `http://localhost:8000/api/users/${selectedUser._id}`
                : 'http://localhost:8000/api/users';

            const method = selectedUser ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(selectedUser ? 'Failed to update user' : 'Failed to create user');
            }

            setModalOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
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
                    <button
                        type="button"
                        className="btn btn-primary rounded-3 py-1 px-2"
                        style={{ fontSize: '0.875rem' }}
                        onClick={() => handleEdit(row)}
                    >
                        Ed it
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger rounded-3 py-1 px-2"
                        style={{ fontSize: '0.875rem' }}
                        onClick={() => handleDelete(row)}
                    >
                        De te
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
        <MDBContainer className="py-4">
            <MDBCard>
                <MDBCardBody>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>User Management</h2>
                        <MDBBtn onClick={handleAdd} className="btn-success">
                            Add User
                        </MDBBtn>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <DataTable
                        columns={columns}
                        data={users}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 25, 50]}
                        responsive
                        striped
                        highlightOnHover
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
                                    <MDBInput
                                        type='password'
                                        label='Password'
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!selectedUser}
                                    />
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
    );
};

export default UserManagement; 