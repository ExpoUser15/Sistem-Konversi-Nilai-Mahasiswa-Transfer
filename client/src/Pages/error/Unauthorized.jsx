import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <img src="/3814338.jpg" alt="" className="w-[400px]" />
      <div className="flex flex-col items-center">
        <h4>Halaman ini tidak dapat diakses.</h4>
        <Link
          to={`/login`}
          className="bg-slate-800 text-white p-3 rounded-sm hover:bg-slate-700 duration-200"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
