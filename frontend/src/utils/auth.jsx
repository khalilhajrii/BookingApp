import { jwtDecode } from 'jwt-decode';

export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

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