import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/login/Login';
import DashboardAkademik from "./Pages/akademik/DashboardAkademik";
import DashboardKaprodi from "./Pages/kaprodi/DashboardKaprodi";
import PrivateRoutes from './utils/PrivateRoutes';
import Konversi from './Pages/kaprodi/Konversi';
import LogAktivitas from './Pages/kaprodi/LogAktivitas';
import Pengguna from './Pages/kaprodi/Pengguna';
import MataKuliah from './Pages/kaprodi/MataKuliah';
import Mahasiswa from './Pages/kaprodi/Mahasiswa';
import AkademikLayout from './layout/AkademikLayout';
import KaprodiLayout from './layout/KaprodiLayout';
import Unauthorized from './Pages/error/Unauthorized';
import Laporan from './Pages/akademik/Laporan';
import KonversiDetail from './Pages/kaprodi/KonversiDetail';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route untuk Akademik */}
          <Route element={<PrivateRoutes allowedRole="Akademik" />}>
            <Route element={<AkademikLayout />}>
              <Route path="/akademik" element={<DashboardAkademik />} />
              <Route path="/akademik/laporan" element={<Laporan />} />
              <Route path="/konversi-detail/:id" element={<KonversiDetail />} />
            </Route>
          </Route>

          {/* Route untuk Kaprodi */}
          <Route element={<PrivateRoutes allowedRole="Kaprodi" />}>
            <Route element={<KaprodiLayout />}>
              <Route path="/kaprodi" element={<DashboardKaprodi />} />
              <Route path="/kaprodi/konversi" element={<Konversi />} />
              <Route path="/kaprodi/mahasiswa" element={<Mahasiswa />} />
              <Route path="/kaprodi/pengguna" element={<Pengguna />} />
              <Route path="/kaprodi/matakuliah" element={<MataKuliah />} />
              <Route path="/kaprodi/konversi/konversi-detail/:id" element={<KonversiDetail />} />
            </Route>
          </Route>

          {/* Route untuk login */}
          <Route path="/login" element={<Login />} />

          {/* Route jika user mencoba mengakses halaman yang tidak sesuai dengan role */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
