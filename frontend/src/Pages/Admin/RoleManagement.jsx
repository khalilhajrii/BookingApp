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
    MDBInputGroup
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleName, setRoleName] = useState('');
    const [success, setSuccess] = useState('');
    const [roleCounts, setRoleCounts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
        fetchRoleCounts();
    }, []);

    useEffect(() => {
        filterRoles();
    }, [searchTerm, roles]);

    useEffect(() => {
        console.log('Role Counts:', roleCounts);
    }, [roleCounts]);

    const filterRoles = () => {
        if (!searchTerm) {
            setFilteredRoles(roles);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        const results = roles.filter(role => {
            return (
                (role.name && role.name.toLowerCase().includes(lowercasedTerm))
            );
        });

        setFilteredRoles(results);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/role/getAllRoles', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            const rolesData = data.roles || [];
            setRoles(rolesData);
            setFilteredRoles(rolesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoleCounts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/getAllusers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            const users = data.users || [];
            
            // Count users by role
            const counts = {};
            users.forEach(user => {
                if (user.role && user.role._id) {
                    counts[user.role._id] = (counts[user.role._id] || 0) + 1;
                }
            });
            
            setRoleCounts(counts);
        } catch (err) {
            console.error('Error fetching role counts:', err);
        }
    };

    const handleAdd = () => {
        navigate('/admin-dashboard/roles/add');
    };

    const handleEdit = (role) => {
        navigate(`/admin-dashboard/roles/edit/${role._id}`);
    };

    const confirmDelete = async (role) => {
        const userConfirmed = window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`);
        if (userConfirmed) {
            setRoleToDelete(role);
            await handleDelete();
        }
    };

    const handleDelete = async () => {
        if (!roleToDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/role/deleteRole/${roleToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Handle specific error cases
                if (response.status === 409 || responseData.message?.includes('in use')) {
                    throw new Error(`Cannot delete role "${roleToDelete.name}" because it is assigned to one or more users.`);
                }

                throw new Error(responseData.message || 'Failed to delete role');
            }

            // Show success message
            setSuccess(responseData.message || `Role "${roleToDelete.name}" deleted successfully`);
            setTimeout(() => setSuccess(''), 3000);

            setRoleToDelete(null);
            fetchRoles();
            fetchRoleCounts(); // Refresh role counts
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!roleName.trim()) {
            setError('Role name cannot be empty');
            return;
        }
        
        try {
            const url = selectedRole
                ? `http://localhost:8000/api/role/updateRole/${selectedRole._id}`
                : 'http://localhost:8000/api/role/addRole';

            const method = selectedRole ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: roleName.trim() })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Operation failed');
            }

            // Show success message
            setSuccess(responseData.message || (selectedRole 
                ? `Role "${roleName}" updated successfully` 
                : `Role "${roleName}" created successfully`));
            setTimeout(() => setSuccess(''), 3000);

            setModalOpen(false);
            fetchRoles();
            fetchRoleCounts(); // Refresh role counts
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const columns = [
        {
            name: 'Role Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Users',
            width: '100px',
            cell: row => (
                <MDBBadge color="info" pill>
                    {roleCounts[row._id] || 0}
                </MDBBadge>
            ),
            sortable: true,
            sortFunction: (rowA, rowB) => {
                const countA = roleCounts[rowA._id] || 0;
                const countB = roleCounts[rowB._id] || 0;
                return countA - countB;
            }
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
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger rounded-3 py-1 px-2"
                        style={{ fontSize: '0.875rem' }}
                        onClick={() => confirmDelete(row)}
                        title={roleCounts[row._id] > 0 ? "Cannot delete a role that's in use" : "Delete role"}
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
        <MDBContainer className="py-4">
            <MDBCard>
                <MDBCardBody>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Role Management</h2>
                        <button onClick={handleAdd} className="btn btn-success">
                            Add Role
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            {success}
                        </div>
                    )}

                    <div className="mb-4">
                        <MDBInputGroup>
                            <MDBInput
                                placeholder="Search by role name..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </MDBInputGroup>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredRoles}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 25, 50]}
                        responsive
                        striped
                        highlightOnHover
                        noDataComponent={
                            <div className="text-center py-4">
                                {searchTerm ? "No roles found matching your search" : "No roles available"}
                            </div>
                        }
                    />
                </MDBCardBody>
            </MDBCard>

            <MDBModal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Confirm Deletion</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={() => setDeleteModalOpen(false)}></MDBBtn>
                        </MDBModalHeader>

                        <MDBModalBody>
                            {roleToDelete && (
                                <p>Are you sure you want to delete the role "{roleToDelete.name}"? This action cannot be undone.</p>
                            )}
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn type="button" color='secondary' onClick={() => setDeleteModalOpen(false)}>
                                Cancel
                            </MDBBtn>
                            <MDBBtn type="button" color='danger' onClick={handleDelete}>
                                Delete
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            <MDBModal show={modalOpen} onHide={() => setModalOpen(false)} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <form onSubmit={handleSubmit}>
                            <MDBModalHeader>
                                <MDBModalTitle>{selectedRole ? 'Edit Role' : 'Add Role'}</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={() => setModalOpen(false)}></MDBBtn>
                            </MDBModalHeader>

                            <MDBModalBody>
                                <div className="mb-3">
                                    <MDBInput
                                        label='Role Name'
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        required
                                    />
                                </div>
                            </MDBModalBody>

                            <MDBModalFooter>
                                <MDBBtn type="button" color='secondary' onClick={() => setModalOpen(false)}>
                                    Cancel
                                </MDBBtn>
                                <MDBBtn type="submit" color='primary'>
                                    {selectedRole ? 'Update' : 'Create'}
                                </MDBBtn>
                            </MDBModalFooter>
                        </form>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer>
    );
};

export default RoleManagement;