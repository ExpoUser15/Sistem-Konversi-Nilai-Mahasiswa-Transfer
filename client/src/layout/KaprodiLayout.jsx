import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/navigation/Sidebar';
import ModeButtons from '../components/buttons/ModeButtons';
import { House, Repeat, User, Logs, Users } from "lucide-react";
import { ModeProvider } from '../context/ModeContext';
import axios from 'axios';

function KaprodiLayout() {
  const location = useLocation();
  const path = location.pathname; 

  return (
    <ModeProvider>
      <ModeButtons />
      <div className='flex font-poppins h-screen overflow-hidden'>
        <Sidebar>
          <SidebarItem icon={<House />} text="Home" active={path === "/kaprodi"} path={"/kaprodi"} />
          <SidebarItem icon={<Repeat />} text="Konversi" active={path === '/kaprodi/konversi'} alert={true} path={"/kaprodi/konversi"} />
          <SidebarItem icon={<Users />} text="Mahasiswa" active={path === '/kaprodi/mahasiswa'} path={"/kaprodi/mahasiswa"} />
          <SidebarItem icon={<User />} text="Pengguna" active={path === '/kaprodi/pengguna'} path={"/kaprodi/pengguna"} />
          <SidebarItem icon={<Logs />} text="Mata Kuliah" active={path === '/kaprodi/matakuliah'} path={"/kaprodi/matakuliah"} />
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

export default KaprodiLayout;
