import { ChevronsRight, ChevronsLeft, LogOut } from "lucide-react"
import { useContext, createContext, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ModeContext } from "../../context/ModeContext";

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const { theme } = useContext(ModeContext);
  const imgRef = useRef();

  useEffect(() => {
    imgRef.current.src = localStorage.theme !== 'dark' ? "/logo dan prodi.png" : "/logo dan prodi dark mode.png";
  }, [theme]);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white dark:bg-black dark:text-slate-200 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            ref={imgRef}
            src={localStorage.theme !== "dark" ? "/logo dan prodi.png" : "/logo dan prodi dark mode.png"} 
            className={`overflow-hidden transition-all ${expanded ? "w-48" : "w-0"
              }`}
            alt=""
            loading="lazy"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-[#2C2C2E] dark:text-slate-200"
          >
            {expanded ? <ChevronsLeft /> : <ChevronsRight />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex items-center ms-5 py-5">
          <LogOut />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="">
              <Link className="font-medium text-darkgray no-underline dark:text-slate-200" to={"/logout"}>Logout</Link>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, path, alert }) {
  const { expanded } = useContext(SidebarContext)

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
      <Link className="flex items-center no-underline text-darkgray dark:text-slate-200" to={path}>
        {icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
            }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"
              }`}
          />
        )}

        {!expanded && (
          <div
            className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  )
}
