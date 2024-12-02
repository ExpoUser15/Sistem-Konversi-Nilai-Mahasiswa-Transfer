import React, { useEffect, useRef, useState } from 'react'
import Tables from '../../components/Tables/Tables';
import { Edit, Eye, Trash2 } from 'lucide-react';
import ActionButton from '../../components/Buttons/ActionButton';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/ModalBox/Modal';
import Input from '../../components/Inputs/Input';
import { useSelectedProperties } from '../../hooks/useGetSelectedProperty';
import { useDispatch, useSelector } from 'react-redux';
import { deleteData, fetchData, patchData, postData, updateData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/Loader/Loading';
import Notification from '../../components/Notifications/Notification';
import SearchField from '../../components/Inputs/SearchingInput';

function Pimpinan() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.apiData.data);
    const loading = useSelector(state => state.apiData.loading);
    const action = useSelector(state => state.apiData.action);
    const message = useSelector(state => state.apiData.message);
    const status = useSelector(state => state.apiData.status);

    const notifRef = useRef();
    const editKodeRef = useRef();

    const [dataPimpinan, setDataPimpinan] = useState({});
    const [value, setValue] = useState({});
    const [nama, setNama] = useState("");
    const [kode, setKode] = useState(["1", "2", '3', '4']);

    const [isModalTambah, setIsModalTambah] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'pimpinan' }));
    }, [dispatch]);

    const openModal = (item, item2) => {
        if (item === 'edit') {
            setIsModalEdit(true)
            setDataPimpinan(item2);
            return;
        }

        if (item === 'tambah') {
            setValue({});
            setIsModalTambah(true)
            return;
        }
        if (item === 'hapus') {
            setDataPimpinan(item2);
            setIsDeleteModal(true)
            return;
        }
        setIsModalOpen(true);
        setNama(item2);
    };

    const closeModal = () => {
        setIsModalTambah(false);
        setIsModalEdit(false);
        setIsDeleteModal(false);
    };

    const handleInputValue = async (e, item, action, file) => {
        const inputvalue = e.target.value;
        if (action === 'edit') {
            setValue({
                ...value,
                [item]: inputvalue
            });
            return;
        }

        const addData = {
            ...value,
            [item]: inputvalue
        }
        setValue(addData);
    }

    const handleAction = async (e, actionType) => {
        e.preventDefault();
        await new Promise(resolve => setTimeout(resolve, 0));
        if (actionType === 'tambah') {
            dispatch(postData({ endpoint: 'pimpinan/add', data: value }));
            setIsModalTambah(false);
        }

        if (actionType === 'hapus') {
            dispatch(deleteData({ endpoint: `pimpinan/delete/${dataPimpinan.kode}` }));
            setIsDeleteModal(false);
        }

        if (actionType === 'edit') {
            const selectedProperties = useSelectedProperties(dataPimpinan, ['nama', 'jabatan']);
            const updatedData = {
                ...selectedProperties,
                ...value
            }
            dispatch(updateData({ endpoint: `pimpinan/update/${dataPimpinan.kode}`, data: updatedData }));
            setIsModalEdit(false);
            setValue({});
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
                <h3 className="font-medium">Pimpinan</h3>
            </div>
            <div className='mb-16 mt-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700'>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between sm:mb-5 mb-10">
                    <h4 className="font-medium">Daftar Pimpinan</h4>
                    <SearchField placeholder={"Cari..."} searchType={"pimpinan"} />
                </div>
                <Tables fields={["Kode", "Nama", "Jabatan", ""]} gap={"5"}>
                    {!loading ? (
                        data.length > 0 ? (
                            data.map((item, index) => (
                                <div
                                    className="min-w-[700px] sm:max-h-fit grid grid-cols-4 mb-7 text-sm-3 gap-5 pb-2"
                                    key={btoa(item.kode)} style={{ borderBottom: "1px solid #CCCCCC" }}
                                >
                                    <div>{item.kode}</div>
                                    <div className="overflow-auto">{item.nama}</div>
                                    <div>{item.jabatan}</div>
                                    <div className="flex">
                                        <ActionButton text="Edit" onClick={() => openModal('edit', item)}>
                                            <Edit className="cursor-pointer" />
                                        </ActionButton>
                                        <ActionButton text="Hapus" onClick={() => openModal('hapus', item)}>
                                            <Trash2 className="cursor-pointer" />
                                        </ActionButton>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2" key="empty">
                                <p className="text-center col-span-10 italic">Data Kosong</p>
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2">
                            <div className="col-span-10 flex justify-center">
                                <Loading />
                            </div>
                        </div>
                    )}
                </Tables>
                <Button text={"Tambah"} className={"mt-2 ms-auto"} onClick={(e) => { e.preventDefault(); openModal("tambah"); }} />
            </div>
            <Modal className={"w-fit"} open={isModalEdit}>
                <Modal.ModalCustom onClose={() => { closeModal('edit') }} title={"Edit Data Pimpinan"} formClass={'grid grid-cols-2 gap-x-6'} onClick={(e) => { handleAction(e, 'edit'); }} action={true}>
                    <Input.TextInput type={'text'} label={"Nama"} value={dataPimpinan.nama} width={"full"} onChange={(e) => { handleInputValue(e, 'nama', 'edit') }} />
                    <Input.TextInput value={dataPimpinan.jabatan} label={"Jabatan"} width={"full"} onChange={(e) => { handleInputValue(e, 'jabatan', 'edit') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal className={"w-fit"} open={isModalTambah}>
                <Modal.ModalCustom onClose={() => { closeModal('tambah') }} title={"Tambah Data Pimpinan"} formClass={'grid grid-cols-2 gap-x-6'} onClick={(e) => { handleAction(e, 'tambah'); }} action={true}>
                    <Input.TextInput type={'text'} label={"Nama"} width={"full"} onChange={(e) => { handleInputValue(e, 'nama', 'tambah') }} />
                    <Input.SelectInput value={kode} label={"Kode"} width={"full"} onChange={(e) => { handleInputValue(e, 'kode', 'tambah') }} />
                    <Input.TextInput type={'text'} label={"Jabatan"} width={"full"} onChange={(e) => { handleInputValue(e, 'jabatan', 'tambah') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus pimpinan '${dataPimpinan.nama}'?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
        </>
    )
}

export default Pimpinan;