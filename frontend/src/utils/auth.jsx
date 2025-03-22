import { jwtDecode } from 'jwt-decode';

export const getUserDataFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return {
    userId: decodedToken.userid,
    fullName: decodedToken.fullname,
    email: decodedToken.email,
    dateOfBirth: new Date(decodedToken.dateofbirth).toLocaleDateString(),
    role: decodedToken.role,
  };
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};