import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/buttons/Button';
import Tables from '../../components/tables/Tables';
import { useDispatch, useSelector } from 'react-redux';
import { deleteKonversiData, fetchData, fetchKonversiData, updateData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/loader/Loading';
import ActionButton from '../../components/buttons/ActionButton';
import { ArrowDownToLine, Edit, Trash2 } from 'lucide-react';
import { addKonversi } from '../../redux/slices/konversiSlice';
import Modal from '../../components/modalBox/Modal';
import Input from '../../components/inputs/Input';
import { useSelectedProperties } from '../../hooks/useGetSelectedProperty';
import axios from 'axios';
import useDownload from '../../hooks/useDownload';

function KonversiDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // Ambil ID yang di-encode di URL
    const { id_mahasiswa, nama } = JSON.parse(atob(id));

    const loading = useSelector(state => state.konversi.loading);
    const data = useSelector(state => state.konversi.konversiData);
    const mkData = useSelector(state => state.apiData.data);

    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [dataKonversi, setDataKonversi] = useState(false);
    const [value, setValue] = useState(false);

    useEffect(() => {
        dispatch(fetchKonversiData({ endpoint: `konversi/detail/${id_mahasiswa}` }));
        dispatch(fetchData({ endpoint: `matakuliah` }));
    }, [dispatch]);

    // const openModal = (cek, item) => {
    //     if (cek === 'edit') {
    //         setIsModalEdit(true);
    //         setDataKonversi(item);
    //     }

    //     if (cek === 'hapus') {
    //         setIsDeleteModal(true);
    //     }
    // }

    // const closeModal = () => {
    //     setIsDeleteModal(false);
    //     setIsModalEdit(false);
    // }

    // const handleInputValue = async (e, item) => {
    //     const inputvalue = e.target.value;

    //     setValue({
    //         ...value,
    //         [item]: inputvalue
    //     });
    // }

    // const handleAction = async (e, actionType, item) => {
    //     e.preventDefault();
    //     await new Promise(resolve => setTimeout(resolve, 0));
    //     if (actionType === 'hapus') {
    //         dispatch(deleteKonversiData({ endpoint: `konversi/preview/delete/${dataKonversi.id_mahasiswa}` }));
    //         setIsDeleteModal(false);
    //     }

    //     if (actionType === 'edit') {
    //         const selectedProperties = useSelectedProperties(dataKonversi, ['id_mahasiswa', 'mk_asal', 'sks_asal', 'nilai_asal', 'id_mk', 'mata_kuliah', 'sks', 'nilai_tujuan']);
    //         const updatedData = {
    //             ...selectedProperties,
    //             ...value
    //         }
    //         dispatch(updateData({ endpoint: `konversi/update/${dataKonversi.mata_kuliah}/${dataKonversi.id_mk}`, data: updatedData }));
    //         setIsModalEdit(false);
    //         setValue({});
    //     }
    // }

    const goBack = () => {
        navigate(-1); // Kembali ke halaman sebelumnya
    };

    const downloadFile = useDownload();

    const handleGeneratePDF = () => {
        axios.get(`http://localhost:3000/konversi/${id_mahasiswa}`)
        .then(res => {
            const { data } = res;

            downloadFile(data.data[0].report);
        })
    }

    return (
        <>
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Detail Konversi {nama}</h3>
            </div>
            <main className="my-16">
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Detail Konversi</h4>
                    </div>
                    <Tables fields={["Mata Kuliah Asal", "SKS Asal", "Nilai Asal", "Mata Kuliah Tujuan", "SKS Tujuan", "Nilai Tujuan"]} gap={"5"}>
                        {
                            !loading ?
                                data
                                    .map((item, index) => (
                                        <div
                                            className={`grid grid-cols-6 mb-7 text-sm-3 gap-5 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={item.id_mk}
                                        >
                                            <div className='overflow-auto'>{item.mk_asal}</div>
                                            <div className='ps-3'>{item.sks_asal}</div>
                                            <div className='ps-3'>{item.nilai_asal}</div>
                                            <div>{item.mata_kuliah}</div>
                                            <div className='ps-3'>{item.sks}</div>
                                            <div className='ps-3'>{item.nilai_tujuan}</div>
                                            {/* <div className='flex gap-2 items-center justify-start '>
                                                <ActionButton text={"Edit"}>
                                                    <Edit className='cursor-pointer' onClick={() => openModal('edit', item)} />
                                                </ActionButton>
                                                <ActionButton text={"Hapus"} onClick={() => openModal('hapus', item)}>
                                                    <Trash2 className='cursor-pointer' />
                                                </ActionButton>
                                            </div> */}
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
                    <div className='flex gap-2'>
                        <Button onClick={handleGeneratePDF}>
                            Generate PDF
                        </Button>
                        <Button onClick={goBack} className={'bg-red-500 border-red-500'}>
                            Kembali
                        </Button>
                    </div>
                </div>
            </main>

            {/* <Modal className={"w-fit"} open={isModalEdit}>
                <Modal.ModalCustom onClose={() => { closeModal('edit') }} title={"Edit Data Mahasiswa"} formClass={'grid grid-cols-2 gap-x-6'} onClick={(e) => { handleAction(e, 'edit'); }} action={true}>
                    <Input.TextInput type={'text'} label={"Mata Kuliah asal"} value={dataKonversi.mk_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'mk_asal', 'edit') }} />
                    <Input.TextInput type={'text'} label={"SKS Asal"} value={dataKonversi.sks_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'sks_asal', 'edit') }} />
                    <Input.TextInput type={'text'} label={"Nilai Asal"} value={dataKonversi.nilai_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'nilai_asal', 'edit') }} />
                    <Input.SelectInput label={"Mata Kuliah Tujuan"} value={mkData} width={"full"} onChange={(e) => { handleInputValue(e, 'mata_kuliah', 'edit') }} data={['', dataKonversi.id_mk]}/>
                    <Input.TextInput type={'text'} label={"SKS Tujuan"} value={dataKonversi.sks} width={"full"} onChange={(e) => { handleInputValue(e, 'sks', 'edit') }} />
                    <Input.TextInput type={'text'} label={"Nilai Tujuan"} value={dataKonversi.nilai_tujuan} width={"full"} onChange={(e) => { handleInputValue(e, 'nilai_tujuan', 'edit') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus hasil konversi?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal> */}
        </>
    )
}

export default KonversiDetail