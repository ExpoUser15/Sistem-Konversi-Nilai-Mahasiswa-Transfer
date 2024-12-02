import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/thunks/loginApiThunks';

const PrivateRoutes = ({ allowedRole }) => {
    const dispatch = useDispatch();
    const validasi = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'login' }));
    }, [dispatch]);

    const data = useSelector(state => state.loginData.data);

    useEffect(() => {
        if (!validasi) {
            navigate('/login');
        }

        if (validasi.user !== allowedRole) {
            navigate('/unauthorized');
        }
    }, [validasi]);

    return <Outlet />;
}

export default PrivateRoutes;