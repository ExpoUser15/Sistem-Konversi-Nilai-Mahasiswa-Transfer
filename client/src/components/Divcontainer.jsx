import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Notification from "./Notifications/Notification";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addLoginData } from "../redux/slices/loginSlice";

axios.defaults.withCredentials = true;
const Divcontainer = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("");
  const [action, setAction] = useState(false);
  const [message, setMessage] = useState("");

  const notifRef = useRef();

  const url = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    axios
      .get(`${url}login`)
      .then((res) => {
        const { data } = res;
        const { auth } = data;
        dispatch(addLoginData(auth));
        console.log(data);
        if (auth?.status === "Success") {
          navigate(`/${auth.data.user.toLowerCase()}`);
        }
      })
      .catch((err) => {
        const { response } = err;
        setStatus(response.data.status);
        setMessage(response.data.message);
        setAction(true);
      });
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(
        `${url}auth`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        const { data } = res;

        if (data.auth.status === "Success") {
          navigate(`/${data.auth.data.user.toLowerCase()}`);
        }
      })
      .catch((err) => {
        const { response } = err;
        setStatus(response.data.status);
        setMessage(response.data.message);
        setAction(true);
      });
  };

  return (
    <>
      <Notification
        text={message}
        status={status}
        state={action}
        notifRef={notifRef}
        setAction={setAction}
      />
      <div
        className={`max-w-[350px] shadow-[0px_30px_30px_-20px_rgba(133,_189,_215,_0.88)] rounded-21xl [background:linear-gradient(0deg,_#fff,_#f4f7fb)] border-white border-[5px] border-solid box-border overflow-hidden shrink-0 flex flex-col items-start justify-start pt-4 pb-[68px] pl-5 pr-2.5 gap-[39px] z-[1] text-center text-11xl text-steelblue font-roboto mq450:gap-[19px] mq450:pt-5 mq450:pb-11 mq450:box-border ${className}`}
      >
        <div className="w-[310px] flex flex-row items-start justify-between gap-5">
          <div className="flex flex-col items-start justify-start py-0 pl-0 pr-[9px]">
            <img
              className="w-[50px] h-[50.1px] relative object-cover"
              loading="lazy"
              alt="logo"
              src="/r-1@2x.png"
            />
          </div>
          <div className="w-[93.3px] flex flex-col items-start justify-start pt-[76px] px-0 pb-0 box-border">
            <h1 className="m-0 self-stretch relative text-inherit font-black font-[inherit] mix-blend-normal mq450:text-lg mq1050:text-5xl">
              Login
            </h1>
          </div>
          <img
            className="h-[52.5px] w-[70px] relative object-cover"
            loading="lazy"
            alt="kampus-logo"
            src="/kampus-merdeka-1@2x.png"
          />
        </div>
        <div className="w-[310px] flex flex-row items-start justify-start py-0 pl-[15px] pr-[25px] box-border">
          <form className="m-0 flex-1 flex flex-col items-start justify-start gap-5">
            <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
              <input
                className="w-full bg-white self-stretch h-[45px] shadow-[0px_10px_10px_-5px_#cff0ff] rounded-xl py-[15px] px-[22px] box-border font-roboto text-sm-3 text-darkgray"
                placeholder="Username"
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <div className="self-stretch flex flex-col items-start justify-start gap-2.5">
                <input
                  className="w-full bg-white self-stretch h-[45px] shadow-[0px_10px_10px_-5px_#cff0ff] rounded-xl py-[15px] px-[22px] box-border font-roboto text-sm-3 text-darkgray"
                  placeholder="Password"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <button
              className="py-[15px] px-5 bg-[transparent] self-stretch shadow-[0px_20px_10px_-15px_rgba(133,_189,_215,_0.88)] rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 ease-out"
              onClick={handleLogin}
            >
              <b className="font-roboto text-center">Login</b>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

Divcontainer.propTypes = {
  className: PropTypes.string,
};

export default Divcontainer;
