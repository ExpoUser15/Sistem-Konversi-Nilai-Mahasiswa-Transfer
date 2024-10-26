import Card from "../../components/Cards/CardAnalytics";
import { Eye } from "lucide-react";
import Tables from "../../components/Tables/Tables";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/thunks/apiThunks";
import ActionButton from "../../components/Buttons/ActionButton";
import Modal from "../../components/ModalBox/Modal";
import Input from "../../components/Inputs/Input";
import Loading from "../../components/Loader/Loading";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Greeting from "../../utils/Greeting";

const DashboardKaprodi = () => {
  const dispatch = useDispatch();
  const token = useAuth();
  const navigate = useNavigate();
  const students = useSelector(state => state.apiData.data);
  const loading = useSelector(state => state.apiData.loading);

  const [dataMahasiswa, setDataMahasiswa] = useState({});
  const [berkasName, setBerkasName] = useState("");
  const [nama, setNama] = useState("");
  const [jenisFile, setJenisFile] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetail, setIsModalDetail] = useState(false);

  useEffect(() => {
    dispatch(fetchData({ endpoint: 'mahasiswa/recent/dashboard-kaprodi' }));
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
        {/* Analytics Card */}
        <div>
          <div className="grid grid-cols-3 gap-8">
            <Card text={'Total Mata Kuliah'} drop={false} data={'30'}/>
            <Card text={'Total Pengajuan Konversi'} drop={true} data={'45'}/>
            <Card text={'Average Nilai Konversi'} drop={false} data={'12'}/>
          </div>
        </div>
        
        {/* Table */}
        <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
          <div className="flex gap-2 items-center mb-5">
            <h4 className="font-medium">Riwayat Konversi</h4>
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
                  )) :
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
};

export default DashboardKaprodi;
