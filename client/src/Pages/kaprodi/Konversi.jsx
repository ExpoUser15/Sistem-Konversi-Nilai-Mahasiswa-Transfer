import React, { useEffect, useRef, useState } from 'react'
import Tables from '../../components/Tables/Tables';
import { Edit, Eye } from 'lucide-react';
import ActionButton from '../../components/Buttons/ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import { deleteKonversiData, fetchData, patchData } from '../../redux/thunks/apiThunks';
import Modal from '../../components/ModalBox/Modal';
import Input from '../../components/Inputs/Input';
import Loading from '../../components/Loader/Loading';
import ModalKonversi from '../../components/ModalBox/ModalKonversi';
import Notification from '../../components/Notifications/Notification';
import Button from '../../components/Buttons/Button';
import SearchField from '../../components/Inputs/SearchingInput';
import { formattedDate } from '../../utils/formattedDate';

function Konversi() {
    const dispatch = useDispatch();
    const students = useSelector(state => state.apiData.data);
    const loading = useSelector(state => state.apiData.loading);
    const action = useSelector(state => state.konversi.action);
    const message = useSelector(state => state.konversi.message);
    const status = useSelector(state => state.konversi.status);

    const [dataMahasiswa, setDataMahasiswa] = useState({});
    const [value, setValue] = useState({});
    const [berkasName, setBerkasName] = useState("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [spesifikBerkas, setSpesifikBerkas] = useState({});
    const [jenisFile, setJenisFile] = useState("");
    const [nama, setNama] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [isModalTambah, setIsModalTambah] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [isModalKonversi, setIsModalKonversi] = useState(false);

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'mahasiswa/all' }));
    }, [dispatch]);

    const closeModal = () => {
        setIsModalTambah(false);
        setIsModalEdit(false);
        setIsModalDetail(false);
        setIsDeleteModal(false);
        setIsModalOpen(false);
        setIsModalKonversi(false);
        setIsUploadModalOpen(false);
    };

    const openModal = (item, item2, file) => {
        if (item === "detail") {
            setIsModalDetail(true)
            setDataMahasiswa(item2);
            return;
        }

        if (item === 'edit') {
            setIsModalEdit(true)
            setDataMahasiswa(item2);
            setIsModalKonversi(true);
            return;
        }
        if (item === 'konversi') {
            setDataMahasiswa(item2);
            setIsModalKonversi(true);
            return;
        }

        if (item === 'tambah') {
            setValue({});
            setIsModalTambah(true)
            return;
        }
        if (item === 'hapus') {
            setDataMahasiswa(item2);
            setIsDeleteModal(true)
            return;
        }

        setIsModalOpen(true);
        setBerkasName(item);
        setNama(item2);
        setJenisFile(file);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        setSpesifikBerkas(file);
    }

    const handleAction = async (e, actionType, item) => {
        e.preventDefault();
        await new Promise(resolve => setTimeout(resolve, 0));
        if (actionType === 'hapus') {
            dispatch(deleteKonversiData({ endpoint: `konversi/delete/${dataMahasiswa.id_mahasiswa}/${dataMahasiswa.id_recap}` }));
            setIsDeleteModal(false);
        }
        if (actionType === 'upload') {
            const file = spesifikBerkas;
            const formData = new FormData();
            formData.append('form', file);

            dispatch(patchData({ endpoint: `mahasiswa/transkrip/update/${item.id_mahasiswa}`, data: formData, contentType: 'multipart/form-data' }));
        }
    }

    const notifRef = useRef();
    return (
        <>
            <Notification
                text={message}
                status={status}
                state={action}
                notifRef={notifRef}
            />
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Konversi</h3>
            </div>
            {/* Table */}
            <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between sm:mb-5 mb-10">
                    <h4 className="font-medium">Pengajuan Konversi</h4>
                    <SearchField placeholder={"Cari..."} searchType={'mahasiswa'} />
                </div>
                <Tables fields={["Nama", "Tanggal", "Berkas", "Transkrip", "Surat Pindah", "Detail", "Status", ""]} gap={"5"}>
                    {
                        !loading ?
                            students
                                .filter(item => item.status === "Pending")
                                .map((item, index) => (
                                    <div
                                        className={`min-w-[700px] sm:max-h-fit grid grid-cols-8 mb-7 text-sm-3 pb-2`}
                                        style={{ borderBottom: "1px solid #CCCCCC" }}
                                        key={item.id_mahasiswa}
                                    >
                                        <div className='overflow-auto'>{item.nama}</div>
                                        <div>{formattedDate(item.tanggal)}</div>
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
                                        <div
                                            className='flex'
                                        >
                                            <Button onClick={() => openModal('konversi', item)}>Konversi</Button>
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

            <Modal className={"w-[550px]"} open={isModalOpen}>
                <Modal.ModalBerkas src={berkasName} onClose={closeModal} onClick={(e) => { handleAction(e, 'patch'); }} nama={nama} file={jenisFile} setSpesifikBerkas={setSpesifikBerkas} review={true} />
            </Modal>
            <Modal className={"w-[550px]"} open={isUploadModalOpen}>
                <Modal.ModalBerkas src={berkasName} onClose={closeModal} onClick={(e) => { handleAction(e, 'upload', dataMahasiswa); }} nama={nama} file={jenisFile} setSpesifikBerkas={setSpesifikBerkas} upload={(e) => { handleUpload(e) }} />
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
            <Modal className={"w-fit"} open={isModalEdit}>
                <Modal.ModalCustom onClose={() => { closeModal('edit') }} title={"Edit Data Mahasiswa"} formClass={'grid grid-cols-2 gap-x-6'} onClick={(e) => { handleAction(e, 'edit'); }} action={true}>
                    <Input type={'text'} label={"Nama"} value={dataMahasiswa.nama} width={"full"} onChange={(e) => { handleInputValue(e, 'nama', 'edit') }} />
                    <Input type={'text'} label={"NIM"} value={dataMahasiswa.nim} width={"full"} onChange={(e) => { handleInputValue(e, 'nim', 'edit') }} />
                    <Input type={'text'} label={"Email"} value={dataMahasiswa.email} width={"full"} onChange={(e) => { handleInputValue(e, 'email', 'edit') }} />
                    <Input type={'text'} label={"PT Asal"} value={dataMahasiswa.pt_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'pt_asal', 'edit') }} />
                    <Input type={'text'} label={"Fakultas"} value={dataMahasiswa.fakultas} width={"full"} onChange={(e) => { handleInputValue(e, 'fakultas', 'edit') }} />
                    <Input type={'text'} label={"Prodi"} value={dataMahasiswa.prodi} width={"full"} onChange={(e) => { handleInputValue(e, 'prodi', 'edit') }} />
                    <Input type={'text'} label={"Prodi Tujuan"} value={dataMahasiswa.prodi_tujuan} width={"full"} onChange={(e) => { handleInputValue(e, 'prodi_tujuan', 'edit') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus  hasil konversi'${dataMahasiswa.nama}'?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
            <ModalKonversi open={isModalKonversi} img={dataMahasiswa.transkrip_nilai} data={dataMahasiswa} onClose={closeModal} />
        </>
    )
}

export default Konversi