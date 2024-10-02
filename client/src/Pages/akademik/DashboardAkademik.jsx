import { Eye } from "lucide-react";
import ActionButton from "../../components/buttons/ActionButton";
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
    dispatch(fetchData({ endpoint: 'mahasiswa/laporan' }));
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
        <Greeting name={token.username} />
      </div>
      <main className="my-16">
        <div>
          <h4 className="font-medium">Overview</h4>
        </div>
        <div className="bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
          <div className="flex gap-2 items-center justify-between mb-5">
            <h4 className="font-medium">Pengajuan Konversi Terbaru</h4>
            <SearchField placeholder={"Cari..."} />
          </div>
          <Tables fields={["Nama", "Tanggal", "Berkas", "Transkrip", "Surat Pindah", "Detail", "Dokumen"]} gap={"2"} className={'w-full'}>
            {
              !loading ?
                students
                  .map((item, index) => (
                    <div
                      className={`grid grid-cols-7 mb-7 text-sm-3 gap-1 pb-2`}
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
                      <div
                        className="cursor-pointer w-36 rounded-md"
                      >
                        {
                          item.dokumen ? (
                            <a target='_blank' href={item.dokumen} className='text-black dark:text-slate-200 flex'>
                              <ActionButton text={"Lihat Dokumen"}>
                                <Eye className='cursor-pointer' />
                              </ActionButton>
                            </a>
                          ) : (
                            <div className="italic">
                              Kosong
                            </div>
                          )
                        }
                      </div>
                    </div>
                  )
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