import React, { useEffect, useRef, useState } from 'react'
import Tables from '../../components/Tables/Tables';
import { ArrowDownToLine, Eye, Trash2 } from 'lucide-react';
import ActionButton from '../../components/Buttons/ActionButton';
import Modal from '../../components/ModalBox/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, patchData, postData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/Loader/Loading';
import Notification from '../../components/Notifications/Notification';
import SearchField from '../../components/Inputs/SearchingInput';
import Input from '../../components/Inputs/Input';
import useDownload from '../../hooks/useDownload';
import { formattedDate } from '../../utils/formattedDate';
import axios from 'axios';
import Button from '../../components/Buttons/Button';
import useCompressedImage from '../../hooks/useCompressedImage';

function Laporan() {
    const dispatch = useDispatch();
    const students = useSelector(state => state.apiData.data);
    const loading = useSelector(state => state.apiData.loading);
    const action = useSelector(state => state.apiData.action);
    const message = useSelector(state => state.apiData.message);
    const status = useSelector(state => state.apiData.status);

    const notifRef = useRef();

    const [dataMahasiswa, setDataMahasiswa] = useState({});
    const [berkasName, setBerkasName] = useState("");
    const [nama, setNama] = useState("");
    const [jenisFile, setJenisFile] = useState({});
    const [spesifikBerkas, setSpesifikBerkas] = useState({});
    const [isModalDetail, setIsModalDetail] = useState(false);

    const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'mahasiswa/laporan' }));
    }, [dispatch]);

    const openModal = (item, item2, file) => {
        if (item === "detail") {
            setIsModalDetail(true)
            setDataMahasiswa(item2);
            return;
        }

        setIsModalUploadOpen(true);
        setDataMahasiswa(item2);
        setJenisFile(file);
        setBerkasName(item);
        setNama(item2);
    };

    const closeModal = () => {
        setIsModalUploadOpen(false);
        setIsModalDetail(false);
    };

    const handleAction = async (e, actionType) => {
        e.preventDefault();
        await new Promise(resolve => setTimeout(resolve, 0));
        if (actionType === 'upload') {
            const formData = new FormData();
            const compress = await useCompressedImage(spesifikBerkas);
            formData.append('form', compress);
            dispatch(postData({ endpoint: `mahasiswa/upload/${dataMahasiswa.id_mahasiswa}`, data: formData, contentType: 'multipart/form-data' }));
            setIsModalUploadOpen(false);
            setSpesifikBerkas({});
        }
    }

    const downloadFile = useDownload();

    const handleGeneratePDF = (item) => {
        axios.get(`${import.meta.env.VITE_API_URL}file/report/${item.id_mahasiswa}/all`, {
            responseType: 'blob'
        })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const filename = `laporan_${item.nama}_${btoa(item.id_nama + item.id_mahasiswa)}.pdf`;
                downloadFile(url, filename);
            });
    }

    return (
        <>
            <Notification
                text={message}
                status={status}
                state={action}
                notifRef={notifRef}
            />
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Laporan</h3>
            </div>
            <main className="my-16">
                <div className="bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between sm:mb-5 mb-10">
                        <h4 className="font-medium">Laporan</h4>
                        <SearchField placeholder={"Cari..."} />
                    </div>
                    <Tables fields={["No", "Nama", "Tanggal", "Formulir", "Download", "Status"]} gap={"2"} className={'w-full'}>
                        {
                            !loading ? (
                                students.length > 0 ? (
                                    students.map((item, index) => (
                                        <div
                                            className={`min-w-[700px] sm:max-h-fit grid grid-cols-6 mb-7 text-sm-3 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={index}
                                        >
                                            <div>{index + 1}</div>
                                            <div className='overflow-auto'>{item.nama}</div>
                                            <div>{formattedDate(item.tanggal)}</div>
                                            <div className="cursor-pointer">
                                                {
                                                    !item.upload ? (
                                                        <Button onClick={() => { openModal("upload", item.nama, "Formulir"); setDataMahasiswa(item); }}>Upload</Button>
                                                    ) : (
                                                        <ActionButton text={"Lihat Formulir"} onClick={() => { openModal(item.upload, item.nama, "Formulir"); setDataMahasiswa(item); }}>
                                                            <Eye className='cursor-pointer' />
                                                        </ActionButton>
                                                    )
                                                }
                                            </div>
                                            <div>
                                                <ActionButton text={"Download Dokumen"}>
                                                    <ArrowDownToLine className='cursor-pointer' onClick={() => handleGeneratePDF(item)} />
                                                </ActionButton>
                                            </div>
                                            <div className={`w-fit rounded-md ${item.status === 'Converted' ? 'text-green-600' : 'text-yellow-600'}`}>{item.status}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2' key="empty">
                                        <p className='text-center col-span-10 italic'>Data Kosong</p>
                                    </div>
                                )
                            ) : (
                                <div className={`grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2`}>
                                    <div className='col-span-10 flex justify-center'>
                                        <Loading />
                                    </div>
                                </div>
                            )
                        }
                    </Tables>

                </div>
            </main>

            <Modal className={"w-[550px]"} open={isModalUploadOpen}>
                <Modal.ModalBerkas src={berkasName} onClose={closeModal} onClick={(e) => { handleAction(e, 'upload'); }} nama={nama} file={jenisFile} upload={(e) => {
                    setSpesifikBerkas(e);
                }} />
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
    )
}

export default Laporan;