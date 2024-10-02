import React, { useEffect, useRef, useState } from 'react'
import Tables from '../../components/tables/Tables'
import ActionButton from '../../components/buttons/ActionButton';
import { Edit, Plus, Trash2 } from 'lucide-react';
import SearchingInput from '../../components/inputs/SearchingInput';
import Button from '../../components/buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteData, fetchData, postData, updateData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/loader/Loading';
import Modal from '../../components/modalBox/Modal';
import Input from '../../components/inputs/Input';
import Notification from '../../components/notifications/Notification';
import { useSelectedProperties } from '../../hooks/useGetSelectedProperty';

function Pengguna() {
    const dispatch = useDispatch();

    const mk = useSelector(state => state.apiData.data);
    const loading = useSelector(state => state.apiData.loading);
    const action = useSelector(state => state.apiData.action);
    const message = useSelector(state => state.apiData.message);
    const status = useSelector(state => state.apiData.status);

    const notifRef = useRef();

    const [dataMk, setDataMk] = useState({});
    const [value, setValue] = useState({});

    const [isModalTambah, setIsModalTambah] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const openModal = (item, data) => {
        if (item === 'tambah') {
            setIsModalTambah(true);
            return;
        }
        if (item === 'edit') {
            setIsModalEdit(true);
            setDataMk(data);
            return;
        }
        if (item === 'hapus') {
            setIsDeleteModal(true);
            setDataMk(data);
            return;
        }
    };

    const closeModal = () => {
        setIsModalTambah(false);
        setIsModalEdit(false);
        setIsDeleteModal(false);
    };

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'matakuliah' }));
    }, [dispatch]);

    const handleInputValue = async (e, item, action) => {
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
            console.log('Tambahhh: ', value);
            dispatch(postData({ endpoint: 'matakuliah/add', data: value }));
            setIsModalTambah(false);
        }

        if (actionType === 'hapus') {
            dispatch(deleteData({ endpoint: `matakuliah/delete/${dataMk.id_mk}` }));
            setIsDeleteModal(false);
        }

        if (actionType === 'edit') {
            const selectedProperties = useSelectedProperties(dataMk, ['id_mk', 'mata_kuliah', 'sks', 'semester']);
            const updatedData = {
                ...selectedProperties,
                ...value
            }
            dispatch(updateData({ endpoint: `matakuliah/update/${dataMk.id_mk}`, data: updatedData }));
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
                <h3 className="font-medium">Mata Kuliah</h3>
            </div>
            {/* Table */}
            <div className="mb-16 mt-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex gap-2 items-center justify-between mb-5">
                    <h4 className="font-medium">Daftar Mata Kuliah</h4>
                    <SearchingInput placeholder={"Cari..."} searchType={"matakuliah"}/>
                </div>
                <Tables fields={["No", "Kode Mata Kuliah", "Mata Kuliah", "SKS", "Semester", ""]} gap={"1"}>
                    {
                        !loading ? (
                            mk.length > 0 ? (
                                mk.map((item, index) => (
                                    <div
                                        className="grid grid-cols-6 mb-8 text-sm-3 gap-1 pb-2"
                                        style={{ borderBottom: "1px solid #CCCCCC" }}
                                        key={item.id_mk}
                                    >
                                        <div className="overflow-x-auto">{index + 1}</div>
                                        <div className="overflow-x-auto">{item.id_mk}</div>
                                        <div className="overflow-x-auto">{item.mata_kuliah}</div>
                                        <div className="overflow-auto">{item.sks}</div>
                                        <div className="overflow-auto">{item.semester}</div>
                                        <div
                                            className='flex'
                                        >
                                            <ActionButton text={"Edit"}>
                                                <Edit className='cursor-pointer' onClick={() => openModal('edit', mk[index])}/>
                                            </ActionButton>
                                            <ActionButton text={"Hapus"}>
                                                <Trash2 className='cursor-pointer' onClick={() => { openModal('hapus', mk[index]) }}/>
                                            </ActionButton>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2">
                                    <p className="text-center col-span-10 italic">Data Kosong</p>
                                </div>
                            )
                        ) : (
                            <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2">
                                <div className="col-span-10 flex justify-center">
                                    <Loading />
                                </div>
                            </div>
                        )
                    }
                </Tables>
                <Button text={"Tambah"} onClick={() => { openModal('tambah') }} className={"mt-2 ms-auto"}>
                    <Plus size={20} />
                </Button>
            </div>
            
            <Modal className={"w-fit"} open={isModalTambah}>
                <Modal.ModalCustom onClose={() => { closeModal('tambah') }} title={"Tambah Mata Kuliah"} formClass={'grid grid-cols-2 gap-x-6'} action={true} onClick={(e) => { handleAction(e, 'tambah'); }}>
                    <Input.TextInput label={"Kode Mata Kuliah"} width={"full"} type={'text'} onChange={(e) => { handleInputValue(e, 'id_mk', 'tambah') }} />
                    <Input.TextInput label={"Mata Kuliah"} width={"full"} type={'text'} onChange={(e) => { handleInputValue(e, 'mata_kuliah', 'tambah') }} />
                    <Input.SelectInput label={"SKS"} width={"full"} value={['1', '2', '3', '4']} onChange={(e) => { handleInputValue(e, 'sks', 'tambah') }} />
                    <Input.SelectInput label={"Semester"} width={"full"} value={['1', '2', '3', '4', '5', '6', '7', '8']} onChange={(e) => { handleInputValue(e, 'semester', 'tambah') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal className={"w-fit"} open={isModalEdit}>
                <Modal.ModalCustom onClose={() => { closeModal('edit') }} title={"Edit Mata Kuliah"} formClass={'grid grid-cols-2 gap-x-6'} action={true} onClick={(e) => { handleAction(e, 'edit'); }}>
                    <Input.TextInput label={"Kode Mata Kuliah"} width={"full"} value={dataMk.id_mk} type={'text'} onChange={(e) => { handleInputValue(e, 'id_mk', 'edit') }} />
                    <Input.TextInput label={"Mata Kuliah"} width={"full"} type={'text'} value={dataMk.mata_kuliah} onChange={(e) => { handleInputValue(e, 'mata_kuliah', 'edit') }} />
                    <Input.SelectInput label={"SKS"} selected={dataMk.sks} width={"full"} value={['1', '2', '3', '4']} onChange={(e) => { handleInputValue(e, 'sks', 'edit') }} />
                    <Input.SelectInput label={"Semester"} selected={dataMk.semester} width={"full"} value={['1', '2', '3', '4', '5', '6', '7', '8']} onChange={(e) => { handleInputValue(e, 'semester', 'edit') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus Mata Kuliah '${dataMk.mata_kuliah}'?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
        </>
    )
}

export default Pengguna