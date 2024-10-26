import React, { useEffect, useRef, useState } from 'react'
import Tables from '../../components/Tables/Tables';
import { ArrowDownToLine, Eye, Trash2 } from 'lucide-react';
import ActionButton from '../../components/Buttons/ActionButton';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/ModalBox/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, patchData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/Loader/Loading';
import Notification from '../../components/Notifications/Notification';
import SearchField from '../../components/Inputs/SearchingInput';
import Input from '../../components/Inputs/Input';
import useDownload from '../../hooks/useDownload';

function Laporan() {
    const dispatch = useDispatch();
    const laporan = useSelector(state => state.apiData.data);
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

    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(false);
        setIsModalDetail(false);
    };

    const handleAction = async (e, actionType) => {
        e.preventDefault();
        if (actionType === 'patch') {
            const formData = new FormData();
            const key = Object.keys(spesifikBerkas)[0];
            formData.append('form', spesifikBerkas[key]);
            dispatch(patchData({ endpoint: `mahasiswa/laporan/update/${dataMahasiswa.id_dokumen}`, data: formData, contentType: 'multipart/form-data' }));
            setIsModalOpen(false);
            setSpesifikBerkas({});
        }
    }

    const downloadFile = useDownload();

    const handleDownload = (fileUrl) => {
        downloadFile(fileUrl);
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
            {/* Table */}
            <div className="max-w-fit my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex gap-2 items-center justify-between mb-5">
                    <h4 className="font-medium">Daftar Laporan</h4>
                    <SearchField placeholder={"Cari..."} searchType={'laporan'} />
                </div>
                <Tables fields={["Nama", "Tanggal", "Berkas", "Transkrip", "Surat Pindah", "Detail", "Dokumen", ""]} gap={"1"}>
                    {
                        !loading ?
                            laporan
                                .map((item, index) => (
                                    <div
                                        className={`grid grid-cols-8 mb-9 text-sm-3 pb-2`}
                                        style={{ borderBottom: "1px solid #CCCCCC" }}
                                        key={item.id_dokumen}
                                    >
                                        <div className='overflow-auto'>{item.nama}</div>
                                        <div>{item.tanggal}</div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => { openModal([item.ktp, item.kk, item.ijazah], item.nama, ["KTP", "KK", "Ijazah"]); setDataMahasiswa(laporan[index]); }}
                                        >

                                            <ActionButton text={"Lihat Berkas"}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => { openModal(item.transkrip_nilai, item.nama, "Transkrip Nilai"); setDataMahasiswa(laporan[index]); }}
                                        >
                                            <ActionButton text={"Lihat Transkrip"}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => { openModal(item.surat_pindah, item.nama, "Surat Pindah"); setDataMahasiswa(laporan[index]); }}
                                        >
                                            <ActionButton text={"Lihat Surat Pindah"}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => { openModal('detail', item); setDataMahasiswa(laporan[index]); }}
                                        >
                                            <ActionButton text={"Lihat Detail"}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div className="cursor-pointer w-10 rounded-md">
                                            <a target='_blank' href={item.dokumen} className='text-black dark:text-slate-200 flex justify-center'>
                                                <ActionButton text={"Lihat Dokumen"}>
                                                    <Eye className='cursor-pointer' />
                                                </ActionButton>
                                            </a>
                                        </div>
                                        <div>
                                            <ActionButton text={"Download Dokumen"}>
                                                <ArrowDownToLine className='cursor-pointer' onClick={() => handleDownload(item.report)} />
                                            </ActionButton>
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

            <Modal className={"w-[550px]"} open={isModalOpen}>
                <Modal.ModalBerkas src={berkasName} onClose={closeModal} nama={nama} file={jenisFile} review={true} onClick={(e) => { handleAction(e, 'patch'); }} setSpesifikBerkas={setSpesifikBerkas} />
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