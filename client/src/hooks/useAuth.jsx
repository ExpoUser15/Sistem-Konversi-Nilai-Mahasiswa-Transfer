import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; 

const useAuth = () => {
    const tokenFromCookie = Cookies.get('token');

    if (tokenFromCookie) {
        try {
            const decoded = jwtDecode(tokenFromCookie);
            return decoded;
        } catch (error) {
            return false
        }
    } else {
        return false
    }
};

export default useAuth;
