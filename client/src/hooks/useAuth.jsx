 import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const useAuth = (data) => {
    // const tokenFromCookie = Cookies.get('token');
    
    // if (tokenFromCookie) {
    //     try {
    //         const decoded = jwtDecode(tokenFromCookie);
    //         return decoded;
    //     } catch (error) {
    //         return false
    //     }
    // } else {
    //     return false
    // }

    const dispatch = useDispatch();
    const auth = useSelector(state => state.loginData.data);
    
    useEffect(() => {
        console.log(auth);
    }, [dispatch]);
};

export default useAuth;
