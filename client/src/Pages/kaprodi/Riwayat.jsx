import React, { useEffect, useRef, useState } from 'react'
import Tables from '../../components/Tables/Tables';
import { Eye, Trash2 } from 'lucide-react';
import ActionButton from '../../components/Buttons/ActionButton';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteKonversiData, fetchKonversiData, patchData } from '../../redux/thunks/apiThunks';
import Modal from '../../components/ModalBox/Modal';
import Loading from '../../components/Loader/Loading';
import Notification from '../../components/Notifications/Notification';
import Button from '../../components/Buttons/Button';
import SearchField from '../../components/Inputs/SearchingInput';
import RcPagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { formattedDate } from '../../utils/formattedDate';

const locale = {
    prev_page: 'Previous',
    next_page: 'Next',
    jump_to: 'Go to',
    jump_to_confirm: 'Confirm',
    page: 'Page',
    items_per_page: 'items/page',
};

const ITEMS_PER_PAGE = 10;

function Riwayat() {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.apiData.loading);
    const konversiData = useSelector(state => state.konversi.konversiData);
    const action = useSelector(state => state.konversi.action);
    const message = useSelector(state => state.konversi.message);
    const status = useSelector(state => state.konversi.status);

    const [dataMahasiswa, setDataMahasiswa] = useState({});
    const [berkasName, setBerkasName] = useState("");
    const [spesifikBerkas, setSpesifikBerkas] = useState({});
    const [jenisFile, setJenisFile] = useState("");
    const [nama, setNama] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchKonversiData({ endpoint: 'konversi' }));
    }, [dispatch]);

    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = konversiData.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModal(false);
    };

    const openModal = (item, item2, file) => {
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
                <h3 className="font-medium">Riwayat Konversi</h3>
            </div>
            <div className='mb-16 mt-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700'>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between sm:mb-5 mb-10">
                    <h4 className="font-medium">Daftar Hasil Konversi</h4>
                    <SearchField placeholder={"Cari..."} searchType={'mahasiswa'} />
                </div>
                <Tables fields={["No", "Nama", "Tanggal Konversi", "Formulir", "Detail Konversi", "Status", ""]} gap={"2"}>
                    {
                        !loading ? (
                            currentData
                                .length > 0 ? (
                                currentData
                                    .filter(item => item.status === "Converted")
                                    .map((item, index) => (
                                        <div
                                            className={`min-w-[700px] sm:max-h-fit grid grid-cols-7 mb-7 text-sm-3 gap-5 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={item.id_mahasiswa}
                                        >
                                            <div className='overflow-auto'>{index + 1}</div>
                                            <div>{item.nama}</div>
                                            <div>{formattedDate(item.tanggal_recap)}</div>
                                            <div>
                                                {
                                                    !item.upload ? (
                                                        <span className='italic'>Belum diupload</span>
                                                    ) : (
                                                        <ActionButton text={"Lihat Formulir"} onClick={() => { openModal(item.upload, item.nama, "Formulir"); setDataMahasiswa(item); }}>
                                                            <Eye className='cursor-pointer' />
                                                        </ActionButton>
                                                    )
                                                }
                                            </div>
                                            <div>
                                                <Link to={`konversi-detail/${btoa(JSON.stringify({ id_mahasiswa: item.id_mahasiswa, nama: item.nama }))}`}>
                                                    Detail
                                                </Link>
                                            </div>
                                            <div>
                                                <div className={`w-fit rounded-md ${item.status === 'Converted' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {item.status}
                                                </div>
                                            </div>
                                            <div className='flex gap-2 items-center justify-start '>
                                                <ActionButton text={"Hapus"} onClick={() => openModal('hapus', item)}>
                                                    <Trash2 className='cursor-pointer' />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className='grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2' key="empty">
                                    <p className='text-center col-span-10 italic'>Data Kosong</p>
                                </div>
                            )
                        ) : (
                            <div className={`grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2`} >
                                <div className='col-span-10 flex justify-center'>
                                    <Loading />
                                </div>
                            </div>
                        )
                    }
                </Tables>
                <RcPagination
                    current={currentPage}
                    total={konversiData.length}
                    pageSize={ITEMS_PER_PAGE}
                    onChange={handlePageChange}
                    showQuickJumper
                    locale={locale}
                    showLessItems={true}
                    hideOnSinglePage={true}
                />
            </div>

            <Modal className={"w-[550px]"} open={isModalOpen}>
                <Modal.ModalBerkas src={berkasName} onClose={closeModal} nama={nama} file={jenisFile} setSpesifikBerkas={setSpesifikBerkas} review={true} />
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus  hasil konversi'${dataMahasiswa.nama}'?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
        </>
    )
}

export default Riwayat;