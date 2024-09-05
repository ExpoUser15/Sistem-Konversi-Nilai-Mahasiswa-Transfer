import ConversionChart from "../../components/Charts/ConversionChart";
import Card from "../../components/cards/CardAnalytics";
import { ChartNoAxesColumnIncreasing, Table, Eye } from "lucide-react";
import Tables from "../../components/tables/Tables";
import { useState } from "react";
// import ModalBerkas from "../../components/modalBox/ModalBerkas";

const DashboardKaprodi = () => {
  const [transkrip, setTranskrip] = useState("");
  const [nama, setNama] = useState("");
  const [pengajuan, setPengajuan] = useState([
    {
      nama: "gideon",
      tanggal: '22 sep 2024',
      email: "Gideonaja@gmail.com",
      transkrip: '/kampus-merdeka-1@2x.png'
    },
    {
      nama: "Jenny",
      tanggal: '22 sep 2024',
      email: "Gideonaja@gmail.com",
      transkrip: '/logo dan prodi.png'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (item, item2) => {
    setIsModalOpen(true);
    setTranskrip(item);
    setNama(item2);
  };

  return (
    <>
      <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
        <h3 className="font-medium">Good Morning, Gideon.</h3>
      </div>
      <main className="my-16">
        <div>
          <h4 className="font-medium">Overview</h4>
        </div>
        {/* Analytics Card */}
        <div>
          <div className="grid grid-cols-3 gap-8">
            <Card />
            <Card />
            <Card />
          </div>
        </div>
        {/* Chart */}
        <div className="grid grid-cols-1 my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
          <div className="flex gap-2 items-center">
            <ChartNoAxesColumnIncreasing />
            <h4 className="font-medium">Top 6 Mata Kuliah</h4>
          </div>
          <ConversionChart
                categories={["Matematika", "Fisika", "Kimia", "Biologi", "Informatika", "Statistika"]}
                series={[120, 110, 95, 85, 70, 65]}
                height={350}
              />
        </div>
        {/* Table */}
        <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
          <div className="flex gap-2 items-center mb-5">
            <Table />
            <h4 className="font-medium">Pengajuan Konversi</h4>
          </div>
          <Tables col="4" fields={["Nama", "Tanggal", "Email", "Surat Pindah"]} >
            {pengajuan.map((item, index) => (
              <div className={`grid grid-cols-4 mb-4 pb-2`} style={{borderBottom: "1px solid #CCCCCC"}} key={index}>
                <div>{item.nama}</div>
                <div>{item.tanggal}</div>
                <div>{item.email}</div>
                <div className="ms-5 mb-5 cursor-pointer w-10 h-5 bg-gray-50 dark:bg-[#2C2C2E] rounded-md flex items-center justify-center p-1" onClick={() => openModal(item.transkrip, item.nama)}>
                  <Eye />
                </div>
              </div>
            ))}
          </Tables>
        </div>
      </main>

      {/* <ModalBerkas src={transkrip} open={isModalOpen} onClose={closeModal} nama={nama} file={"Surat Pindah"}/> */}
    </>
  );
};

export default DashboardKaprodi;
