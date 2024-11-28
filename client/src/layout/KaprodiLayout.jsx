import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/Navigation/Sidebar';
import ModeButtons from '../components/Buttons/ModeButtons';
import { House, Repeat, User, Logs, Users, History, Briefcase } from "lucide-react";
import { ModeProvider } from '../context/ModeContext';
import { useSelector } from 'react-redux';
import NavigationsButton from '../components/Buttons/NavigationsButton';
import MobileSidebar, { MobileSidebarItem } from '../components/Navigation/MobileSidebar';
import { MobileSidebarProvider } from '../context/MobileSidebarContext';

function KaprodiLayout() {
  const location = useLocation();
  const path = location.pathname;

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const data = useSelector(state => state.apiData.data);

  const pendingStatus = (data) => {
    let status = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 'Pending') {
        status = true;
        break;
      } else {
        status = false;
      }
    }

    useEffect(() => {
      const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return status;
  }

  return (
    <ModeProvider>
      <ModeButtons />
      <div className='flex font-poppins h-screen overflow-hidden'>
        {
          isDesktop ? (
            <Sidebar>
              <SidebarItem icon={<House />} text="Home" active={path === "/kaprodi"} path={"/kaprodi"} />
              <SidebarItem icon={<Repeat />} text="Konversi" active={path === '/kaprodi/konversi'} alert={pendingStatus(data)} path={"/kaprodi/konversi"} />
              <SidebarItem icon={<History />} text="Riwayat Konversi" active={path === '/kaprodi/riwayat'} path={"/kaprodi/riwayat"} />
              <SidebarItem icon={<Users />} text="Mahasiswa" active={path === '/kaprodi/mahasiswa'} path={"/kaprodi/mahasiswa"} />
              <SidebarItem icon={<User />} text="Pengguna" active={path === '/kaprodi/pengguna'} path={"/kaprodi/pengguna"} />
              <SidebarItem icon={<Logs />} text="Mata Kuliah" active={path === '/kaprodi/matakuliah'} path={"/kaprodi/matakuliah"} />
              <SidebarItem icon={<Briefcase />} text="Pimpinan" active={path === '/kaprodi/pimpinan'} path={"/kaprodi/pimpinan"} />
            </Sidebar>
          ) : (
            <MobileSidebarProvider>
              <NavigationsButton />
              <MobileSidebar>
                <MobileSidebarItem icon={<House />} text="Home" active={path === "/kaprodi"} path={"/kaprodi"} />
                <MobileSidebarItem icon={<Repeat />} text="Konversi" active={path === '/kaprodi/konversi'} alert={pendingStatus(data)} path={"/kaprodi/konversi"} />
                <MobileSidebarItem icon={<History />} text="Riwayat Konversi" active={path === '/kaprodi/riwayat'} path={"/kaprodi/riwayat"} />
                <MobileSidebarItem icon={<Users />} text="Mahasiswa" active={path === '/kaprodi/mahasiswa'} path={"/kaprodi/mahasiswa"} />
                <MobileSidebarItem icon={<User />} text="Pengguna" active={path === '/kaprodi/pengguna'} path={"/kaprodi/pengguna"} />
                <MobileSidebarItem icon={<Logs />} text="Mata Kuliah" active={path === '/kaprodi/matakuliah'} path={"/kaprodi/matakuliah"} />
                <MobileSidebarItem icon={<Briefcase />} text="Pimpinan" active={path === '/kaprodi/pimpinan'} path={"/kaprodi/pimpinan"} />
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

export default KaprodiLayout;
