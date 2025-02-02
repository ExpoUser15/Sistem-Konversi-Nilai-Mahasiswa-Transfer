import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { addLoginData } from "../redux/slices/loginSlice";

const PrivateRoutes = ({ allowedRole }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const res = await axios.get(`${url}login`, { withCredentials: true });
        const auth = res?.data?.auth;

        dispatch(addLoginData(auth));
        
        setData(auth);

        if (!auth || auth?.status !== "Success") {
          return navigate("/login");
        }

        if (auth?.data?.user !== allowedRole) {
          return navigate("/unauthorized");
        }
      } catch (error) {
        console.log("Authentication Error:", error);
        navigate("/login");
      }
    };

    handleAuth();
  }, [dispatch, navigate, allowedRole, url]);

  if (data === null) return <div>Loading...</div>;

  return <Outlet />;
};

export default PrivateRoutes;
