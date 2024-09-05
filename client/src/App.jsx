import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/login/Login';
import DashboardAkademik from "./Pages/akademik/DashboardAkademik";
import DashboardKaprodi from "./Pages/kaprodi/DashboardKaprodi";
import PrivateRoutes from './utils/PrivateRoutes';
import Layout from './layout/Layout';
import Konversi from './Pages/kaprodi/Konversi';
import LogAktivitas from './Pages/kaprodi/LogAktivitas';
import Pengguna from './Pages/kaprodi/Pengguna';
import Mahasiswa from './Pages/akademik/Mahasiswa';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Layout />}>
              {/* Kaprodi */}
              {/* <Route path="/kaprodi" element={<DashboardKaprodi />} />
              <Route path="/kaprodi/konversi" element={<Konversi />} />
              <Route path="/kaprodi/pengguna" element={<Pengguna />} />
              <Route path="/kaprodi/aktivitas" element={<LogAktivitas />} /> */}

              {/* Akademik */}
              <Route path="/akademik" element={<DashboardAkademik />} />
              <Route path="/akademik/mahasiswa" element={<Mahasiswa />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
