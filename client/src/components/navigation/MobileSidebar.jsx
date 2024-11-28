import { LogOut, CircleX } from "lucide-react"
import { useContext, createContext, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { fetchData } from "../../redux/thunks/loginApiThunks";
import { logout } from "../../redux/slices/loginSlice";
import Cookies from "js-cookie";
import { MobileSidebarContext, MobileSidebarProvider } from "../../context/MobileSidebarContext";

export default function MobileSidebar({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { expanded, setExpanded } = useContext(MobileSidebarContext);
  
  const imgRef = useRef();
  const sidebarRef = useRef();

  useEffect(() => {
    if (!expanded) {
      sidebarRef.current.classList.replace("-translate-y-[100vh]", "-translate-y-[0]");
    } else {
      sidebarRef.current.classList.replace("-translate-y-[0]", "-translate-y-[100vh]");
    }
  }, [expanded]);

  const handleLogout = (e) => {
    dispatch(fetchData({ endpoint: 'logout' }));
    setExpanded(curr => !curr);
    Cookies.remove('token');
    dispatch(logout(true));
    navigate('/login');
  }

  return (
    <aside className="h-screen fixed z-[9999] bg-white dark:bg-black w-[100%] -translate-y-[100vh] transition duration-700 ease-out" ref={sidebarRef}>
      <nav className="h-full flex flex-col dark:bg-black dark:text-slate-200 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            ref={imgRef}
            src={localStorage.theme !== "dark" ? "/logo dan prodi.png" : "/logo dan prodi dark mode.png"} 
            className={`overflow-hidden transition-all w-48`}
            alt=""
            loading="lazy"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-[#2C2C2E] dark:text-slate-200"
          >
            <CircleX />
          </button>
        </div>

        <ul className="flex-1 px-3">{children}</ul>
          
        <div className="border-t flex items-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-[#232323]">
          <div
            onClick={(e) => { handleLogout(e); }}
            className={`
            flex items-center py-5 ms-5 gap-3 duration-150
            overflow-hidden transition-all ml-3 
            `}
          >
            <LogOut />
            <div className="">
              <a className="font-medium text-darkgray no-underline dark:text-slate-200 ">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function MobileSidebarItem({ icon, text, active, path, alert }) {
  const { setExpanded } = useContext(MobileSidebarContext);

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group 
        ${active
          ? "dark:bg-[#2C2C2E] bg-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 dark:hover:bg-[#232323] text-gray-600"
        }
    `}
    >
      <Link className="flex items-center no-underline text-darkgray dark:text-slate-200" to={path} onClick={() => setExpanded(curr => !curr)}>
        {icon}
        <span
          className={`overflow-hidden transition-all w-52 ml-3`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400`}
          />
        )}
      </Link>
    </li>
  )
}
