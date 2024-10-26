import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoutes = ({ allowedRole }) => {
    const validasi = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!validasi) {
            navigate('/login');
        }
        
        if (validasi.user !== allowedRole) {
            navigate('/unauthorized'); 
        }
    }, [validasi]);

    if (!validasi) {
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