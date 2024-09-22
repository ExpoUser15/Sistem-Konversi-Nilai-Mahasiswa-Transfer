import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/navigation/Sidebar';
import ModeButtons from '../components/buttons/ModeButtons';
import { House, File } from "lucide-react";
import { ModeProvider } from '../context/ModeContext';

function AkademikLayout() {
  const location = useLocation();
  const path = location.pathname; 

  return (
    <ModeProvider>
      <ModeButtons />
      <div className='flex font-poppins h-screen overflow-hidden'>
        <Sidebar>
          <SidebarItem icon={<House />} text="Home" active={path === "/akademik"} path={"/akademik"} />
          <SidebarItem icon={<File />} text="Laporan" active={path === '/akademik/laporan'} path={"/akademik/laporan"} />
        </Sidebar>
        <div className='h-screen bg-[#F6F6F6] p-6 dark:bg-[#121212] dark:text-slate-200 w-full overflow-auto'>
          <section>
            <Outlet />
          </section>
        </div>
      </div>
    </ModeProvider>
  );
}

export default AkademikLayout;
