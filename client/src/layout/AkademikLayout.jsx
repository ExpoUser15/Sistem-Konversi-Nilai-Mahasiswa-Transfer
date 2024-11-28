import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/Navigation/Sidebar';
import ModeButtons from '../components/Buttons/ModeButtons';
import { House, Users } from "lucide-react";
import { ModeProvider } from '../context/ModeContext';
import { MobileSidebarProvider } from '../context/MobileSidebarContext';
import NavigationsButton from '../components/Buttons/NavigationsButton';
import MobileSidebar, { MobileSidebarItem } from '../components/Navigation/MobileSidebar';

function AkademikLayout() {
  const location = useLocation();
  const path = location.pathname;

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ModeProvider>
      <ModeButtons />
      <div className='flex font-poppins h-screen overflow-hidden'>
        {
          isDesktop ? (
            <Sidebar>
              <SidebarItem icon={<House />} text="Home" active={path === "/akademik"} path={"/akademik"} />
              <SidebarItem icon={<Users />} text="Mahasiswa" active={path === '/akademik/mahasiswa'} path={"/akademik/mahasiswa"} />
            </Sidebar>
          ) : (
            <MobileSidebarProvider>
              <NavigationsButton />
              <MobileSidebar>
                <MobileSidebarItem icon={<House />} text="Home" active={path === "/akademik"} path={"/akademik"}/>
                <MobileSidebarItem icon={<Users />} text="Mahasiswa" active={path === '/akademik/mahasiswa'} path={"/akademik/mahasiswa"} />
              </MobileSidebar>
            </MobileSidebarProvider>
          )
        }

        <div className='h-screen pt-14 sm:pt-6 bg-[#F6F6F6] p-6 dark:bg-[#121212] dark:text-slate-200 w-full overflow-auto'>
          <section>
            <Outlet />
          </section>
        </div>
      </div>
    </ModeProvider>
  );
}

export default AkademikLayout;
