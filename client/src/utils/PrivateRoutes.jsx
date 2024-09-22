import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoutes = ({ allowedRole }) => {
    const validasi = useAuth();
    const navigate = useNavigate();
    const auth = useSelector(state => state.loginData.status);
    const logout = useSelector(state => state.loginData.logOut);

    useEffect(() => {
        console.log('Validasi: ', validasi);
        if (!validasi) {
            navigate('/login');
        }
        
        if (validasi.user !== allowedRole) {
            navigate('/unauthorized'); 
        }
    }, [validasi]);

    if (!validasi) {
        console.log('tidakkk : ', validasi);
         <Navigate to="/login" />;
        return;
    }
    
    if (validasi.user !== allowedRole) {
        //  <Navigate to="/unauthorized" />; 
        return;
    }

    return <Outlet />;
}

export default PrivateRoutes;