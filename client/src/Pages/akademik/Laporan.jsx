import React, { useEffect, useRef, useState } from 'react'
import Tables from '../../components/tables/Tables';
import { Eye, Trash2 } from 'lucide-react';
import ActionButton from '../../components/buttons/ActionButton';
import Button from '../../components/buttons/Button';
import Modal from '../../components/modalBox/Modal';
import { useSelectedProperties } from '../../hooks/useGetSelectedProperty';
import { useDispatch, useSelector } from 'react-redux';
import { deleteData, fetchData, patchData, postData, updateData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/loader/Loading';
import Notification from '../../components/notifications/Notification';
import SearchField from '../../components/inputs/SearchingInput';
import Input from '../../components/inputs/Input';

function Laporan() {
    const dispatch = useDispatch();
    const laporan = useSelector(state => state.apiData.data);
    const loading = useSelector(state => state.apiData.loading);
    const action = useSelector(state => state.apiData.action);
    const message = useSelector(state => state.apiData.message);
    const status = useSelector(state => state.apiData.status);

    const notifRef = useRef();

    const [dataMahasiswa, setDataMahasiswa] = useState({});
    const [value, setValue] = useState({});
    const [berkasName, setBerkasName] = useState("");
    const [nama, setNama] = useState("");
    const [jenisFile, setJenisFile] = useState({});
    const [spesifikBerkas, setSpesifikBerkas] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'mahasiswa/laporan' }));
        console.log(laporan);
    }, [dispatch]);

    const openModal = (item, item2, file) => {
        setIsModalOpen(true);
        setBerkasName(item);
        setNama(item2);
        setJenisFile(file);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAction = async (e, actionType) => {
        e.preventDefault();
        console.log(spesifikBerkas);
        if (actionType === 'patch') {
            const formData = new FormData();
            const key = Object.keys(spesifikBerkas)[0];
            formData.append('form', spesifikBerkas[key]);
            dispatch(patchData({ endpoint: `mahasiswa/laporan/update/${dataMahasiswa.id_dokumen}`, data: formData, contentType: 'multipart/form-data' }));
            setIsModalOpen(false);
            setSpesifikBerkas({});
        }
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
            <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex gap-2 items-center justify-between mb-5">
                    <h4 className="font-medium">Daftar Laporan</h4>
                    <SearchField placeholder={"Cari..."} searchType={'mahasiswa'} />
                </div>
                <Tables fields={["Nama", "Tanggal", "Dokumen", "Formulir Lengkap", ""]} gap={"5"}>
                    {
                        !loading ?
                            laporan
                                .map((item, index) => (
                                    <div
                                        className={`grid grid-cols-5 mb-7 text-sm-3 gap-5 pb-2`}
                                        style={{ borderBottom: "1px solid #CCCCCC" }}
                                        key={item.id_dokumen}
                                    >
                                        <div className='overflow-auto'>{item.nama}</div>
                                        <div>{item.tanggal}</div>
                                        <div className="cursor-pointer w-10 rounded-md">
                                            <a target='_blank' href={item.dokumen} className='text-black dark:text-slate-200 flex justify-center'>
                                                <ActionButton text={"Lihat Dokumen"}>
                                                    <Eye className='cursor-pointer' />
                                                </ActionButton>
                                            </a>
                                        </div>
                                        <div
                                            className="cursor-pointer w-36 rounded-md"
                                        >
                                            {
                                                item.formulir ? (
                                                    <ActionButton text={"Lihat Formulir"} onClick={() => { openModal(item.formulir, item.nama, "Formulir Seleksi Calon Mahasiswa"); setDataMahasiswa(laporan[index]); }}>
                                                        <Eye className='cursor-pointer' />
                                                    </ActionButton>
                                                ) : (
                                                    <Input className={'w-fit bg-white ps-0 pt-0'} onChange={(e) => {
                                                        const file = e.target.files[0];

                                                        const formData = new FormData();
                                                        formData.append('form', file);

                                                        dispatch(patchData({ endpoint: `mahasiswa/laporan/update/${item.id_dokumen}`, data: formData, contentType: 'multipart/form-data' }));
                                                    }}></Input>
                                                )
                                            }
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
                <Modal.ModalBerkas src={berkasName} onClose={closeModal} nama={nama} file={jenisFile} review={false} onClick={(e) => { handleAction(e, 'patch'); }} setSpesifikBerkas={setSpesifikBerkas} />
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus mahasiswa '${dataMahasiswa.nama}'?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
        </>
    )
}

export default Laporan;