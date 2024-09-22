import { Eye } from "lucide-react";
import ConversionChart from "../../components/Charts/ConversionChart";
import ActionButton from "../../components/buttons/ActionButton";
import PieChart from "../../components/charts/PieChart";
import Loading from "../../components/loader/Loading";
import SearchField from "../../components/inputs/SearchingInput";
import { useDispatch, useSelector } from "react-redux";
import Tables from "../../components/tables/Tables";
import { fetchData } from "../../redux/thunks/apiThunks";
import { useEffect, useState } from "react";
import Modal from "../../components/modalBox/Modal";
import Input from "../../components/inputs/Input";
import useAuth from "../../hooks/useAuth";
import Greeting from "../../utils/Greeting";

function DashboardAkademik() {
  const dispatch = useDispatch();
  const token = useAuth();
  const students = useSelector(state => state.apiData.data);
  const loading = useSelector(state => state.apiData.loading);

  const [dataMahasiswa, setDataMahasiswa] = useState({});
  const [berkasName, setBerkasName] = useState("");
  const [nama, setNama] = useState("");
  const [jenisFile, setJenisFile] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetail, setIsModalDetail] = useState(false);

  useEffect(() => {
    dispatch(fetchData({ endpoint: 'mahasiswa/recent' }));
  }, [dispatch]);

  const openModal = (item, item2, file) => {
    if (item === "detail") {
      setIsModalDetail(true)
      setDataMahasiswa(item2);
      return;
    }
    setIsModalOpen(true);
    setBerkasName(item);
    setNama(item2);
    setJenisFile(file);
  };

  const closeModal = () => {
    setIsModalDetail(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
        <Greeting name={token.username}/>
      </div>
      <main className="my-16">
        <div>
          <h4 className="font-medium">Overview</h4>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-7 bg-white px-5 py-2 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
            <h4 className="font-medium">Statistik Usia Mahasiswa Pindahan</h4>
            <div className="">
              <ConversionChart
                categories={['18-20', '21-23', '24-26', '27-29', '30+']}
                series={[5, 10, 15, 7, 3]}
              />
            </div>
          </div>
          <div className="col-span-5 bg-white px-5 py-2 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
            <h4 className="font-medium">Jenis Kelamin</h4>
            <div className="m-auto">
              <PieChart series={[45, 55]} height={350} />
            </div>
          </div>
        </div>
        <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
          <div className="flex gap-2 items-center justify-between mb-5">
            <h4 className="font-medium">Pengajuan Konversi Terbaru</h4>
            <SearchField placeholder={"Cari..."} />
          </div>
          <Tables fields={["Nama", "Tanggal", "Berkas", "Transkrip", "Surat Pindah", "Detail", "Status"]} gap={"5"}>
            {
              !loading ?
                students
                  .map((item, index) => (
                    <div
                      className={`grid grid-cols-7 mb-7 text-sm-3 gap-5 pb-2`}
                      style={{ borderBottom: "1px solid #CCCCCC" }}
                      key={index}
                    >
                      <div className='overflow-auto'>{item.nama}</div>
                      <div>{item.tanggal}</div>
                      <div
                        className="cursor-pointer"
                        onClick={() => { openModal([item.ktp, item.kk, item.ijazah], item.nama, ["KTP", "KK", "Ijazah"]); setDataMahasiswa(students[index]); }}
                      >

                        <ActionButton text={"Lihat Berkas"}>
                          <Eye className='cursor-pointer' />
                        </ActionButton>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => { openModal(item.transkrip_nilai, item.nama, "Transkrip Nilai"); setDataMahasiswa(students[index]); }}
                      >
                        <ActionButton text={"Lihat Transkrip"}>
                          <Eye className='cursor-pointer' />
                        </ActionButton>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => { openModal(item.surat_pindah, item.nama, "Surat Pindah"); setDataMahasiswa(students[index]); }}
                      >
                        <ActionButton text={"Lihat Surat Pindah"}>
                          <Eye className='cursor-pointer' />
                        </ActionButton>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => { openModal('detail', students[index]); setDataMahasiswa(students[index]); }}
                      >
                        <ActionButton text={"Lihat Detail"}>
                          <Eye className='cursor-pointer' />
                        </ActionButton>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <div className={`w-fit rounded-md ${item.status === 'Converted' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  )).concat(
                    students.filter(item => item.status === "Pending").length === 0 ? (
                      <div className='grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2' key="empty">
                        <p className='text-center col-span-10 italic'>Data Kosong</p>
                      </div>
                    ) : []
                  ) :
                (
                  <div className={`grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2`} >
                    <div className='col-span-10 flex justify-center'>
                      <Loading />
                    </div>
                  </div>
                )
            }
          </Tables>
        </div>
      </main>

      <Modal className={"w-[550px]"} open={isModalOpen}>
        <Modal.ModalBerkas src={berkasName} onClose={closeModal} nama={nama} file={jenisFile} review={true} />
      </Modal>
      <Modal className={"w-fit"} open={isModalDetail}>
        <Modal.ModalCustom onClose={() => { closeModal('detail') }} title={"Detail Mahasiswa"} formClass={'grid grid-cols-2 gap-x-6'}>
          <Input.TextInput label={"Nama"} value={dataMahasiswa.nama} width={"full"} read={true} />
          <Input.TextInput label={"NIM"} value={dataMahasiswa.nim} width={"full"} read={true} />
          <Input.TextInput label={"Tanggal"} value={dataMahasiswa.tanggal} width={"full"} read={true} />
          <Input.TextInput label={"Email"} value={dataMahasiswa.email} width={"full"} read={true} />
          <Input.TextInput label={"PT Asal"} value={dataMahasiswa.pt_asal} width={"full"} read={true} />
          <Input.TextInput label={"Fakultas"} value={dataMahasiswa.fakultas} width={"full"} read={true} />
          <Input.TextInput label={"Prodi"} value={dataMahasiswa.prodi} width={"full"} read={true} />
          <Input.TextInput label={"Prodi Tujuan"} value={dataMahasiswa.prodi_tujuan} width={"full"} read={true} />
          <Input.TextInput label={"Status"} value={dataMahasiswa.status} width={"full"} read={true} />
        </Modal.ModalCustom>
      </Modal>
    </>
  );
}

export default DashboardAkademik