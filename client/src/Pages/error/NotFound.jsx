import { useNavigate } from "react-router-dom";
import Button from "../../components/Buttons/Button";

const NotFound = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    return (
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <img src="/404.jpg" alt="" className="w-[400px]"/>
        <div className="flex flex-col items-center"> 
          <h4>Halaman yang anda cari tidak ditemukan.</h4>
          <Button onClick={goBack} className="bg-slate-800 text-white p-3 rounded-sm hover:bg-slate-700 duration-200 border-slate-700">Kembali</Button>
        </div>
      </div>
    );
  };
  
  export default NotFound;
  