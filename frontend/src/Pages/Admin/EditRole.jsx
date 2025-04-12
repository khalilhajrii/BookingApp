import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar';

const EditRole = () => {
    const { id } = useParams(); // Get role ID from URL
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/role/getRoleById/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch role');
                }

                setRoleName(data.role.name);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRole();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!roleName.trim()) {
            setError('Role name cannot be empty');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/role/updateRole/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: roleName.trim() })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update role');
            }

            setSuccess(`Role "${roleName}" updated successfully`);
            setTimeout(() => {
                navigate('/admin-dashboard/roles'); // Redirect to Role Management
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <NavBar />
            <h2>Edit Role</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="roleName" className="form-label">Role Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="roleName"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Role</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin-dashboard/roles')}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditRole;