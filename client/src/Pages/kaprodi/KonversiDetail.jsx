import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Buttons/Button';
import Tables from '../../components/Tables/Tables';
import { useDispatch, useSelector } from 'react-redux';
import { deleteKonversiData, fetchData, fetchKonversiData, updateKonversiData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/Loader/Loading';
import ActionButton from '../../components/Buttons/ActionButton';
import { Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/ModalBox/Modal';
import Input from '../../components/Inputs/Input';
import { useSelectedProperties } from '../../hooks/useGetSelectedProperty';
import axios from 'axios';
import useDownload from '../../hooks/useDownload';
import Notification from '../../components/Notifications/Notification';

function KonversiDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); 
    const { id_mahasiswa, nama } = JSON.parse(atob(id));

    const loading = useSelector(state => state.konversi.loading);
    const data = useSelector(state => state.konversi.konversiData);
    const statusKonversi = useSelector(state => state.konversi.status);
    const actionKonversi = useSelector(state => state.konversi.action);
    const messageKonversi = useSelector(state => state.konversi.message);
    const mkData = useSelector(state => state.apiData.data);

    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [dataKonversi, setDataKonversi] = useState(false);
    const [value, setValue] = useState('');

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [action, setAction] = useState('');

    const [dataSemester, setDataSemester] = useState([]);
    const [mkRemaining, setMkRemaining] = useState([]);
    const [IDMK, setIDMK] = useState('');
    const [semesterValue, setSemestervalue] = useState({
        mata_kuliah: '',
        semester: ''
    });

    const sksRef = useRef();

    useEffect(() => {
        dispatch(fetchKonversiData({ endpoint: `konversi/detail/${id_mahasiswa}` }));
        dispatch(fetchData({ endpoint: `matakuliah` }));
        // dispatch(fetchData({ endpoint: `konversi/penempatan/${id_mahasiswa}` }));
    }, [dispatch]);

    useEffect(() => {
        axios.get(`http://localhost:3000/konversi/semester/${id_mahasiswa}`)
            .then(res => {
                setDataSemester(res.data.data);
            }).catch(err => console.log(err));

        axios.get(`http://localhost:3000/konversi/penempatan/${id_mahasiswa}`)
        .then(res => {
            setMkRemaining(res.data.data);
            console.log(res)
        }).catch(err => console.log(err));
    }, []);

    const openModal = (cek, item) => {
        if (cek === 'edit') {
            setIsModalEdit(true);
            setDataKonversi(item);
        }

        if (cek === 'hapus') {
            setIsDeleteModal(true);
        }
    }

    const closeModal = () => {
        setIsDeleteModal(false);
        setIsModalEdit(false);
    }

    const handleInputValue = async (e, item) => {
        const inputvalue = e.target.value;

        setValue({
            ...value,
            [item]: inputvalue
        });
    }

    const handleSelectedValue = (e) => {
        handleInputValue(e, 'id_mk', 'edit'); 
        const findData = mkData.findIndex(item => e.target.value === item.id_mk);
        if(findData !== -1){
            sksRef.current.value = mkData[findData].sks;
        }
    }

    const handleAction = async (e, actionType, item) => {
        e.preventDefault();
        await new Promise(resolve => setTimeout(resolve, 0));
        if (actionType === 'hapus') {
            dispatch(deleteKonversiData({ endpoint: `konversi/detail/delete/${dataKonversi.id_konversi}` }));
            setIsDeleteModal(false);
        }
        
        if (actionType === 'edit') {
            const selectedProperties = useSelectedProperties(dataKonversi, ['id_konversi', 'mk_asal', 'sks_asal', 'nilai_asal', 'id_mk', 'sks', 'nilai_tujuan']);
            const updatedData = {
                ...selectedProperties,
                ...value
            }
            dispatch(updateKonversiData({ endpoint: `konversi/detail/${dataKonversi.id_mahasiswa}`, data: updatedData, contentType: 'application/json' }))
            .catch(err => console.log(err));
            setIsModalEdit(false);
            console.log(updatedData);
            setValue({});
        }
    }

    const handleSave = () => {
        console.log(semesterValue);
        setStatus(null);
        setMessage(null);
        setAction(false);
        axios.post(`http://localhost:3000/konversi/semester/add/${id_mahasiswa}`, semesterValue, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                console.log(res);
                setStatus(res.data.status);
                setMessage(res.data.message);
                setAction(true);
                setDataSemester(res.data.data);
            }).catch(err => {
                setAction(true);
                setStatus(err.response.data.status);
                setMessage(err.response.data.message);
            });
    }

    const goBack = () => {
        navigate(-1);
    };

    const downloadFile = useDownload();

    const handleGeneratePDF = () => {
        axios.get(`http://localhost:3000/konversi/${id_mahasiswa}`)
            .then(res => {
                const { data } = res;
                downloadFile(data.data[0].report);
            });
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
            <Notification
                text={messageKonversi}
                status={statusKonversi}
                state={actionKonversi}
                notifRef={notifRef}
            />
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Detail Konversi {nama}</h3>
            </div>
            <main className="my-16">
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Detail Konversi</h4>
                    </div>
                    <Tables fields={["ID", "Mata Kuliah Asal", "SKS Asal", "Nilai Asal", "Mata Kuliah Tujuan", "SKS Tujuan", "Nilai Tujuan", ""]} gap={"5"}>
                        {
                            !loading ?
                                data
                                    .map((item, index) => (
                                        <div
                                            className={`grid grid-cols-8 mb-7 text-sm-3 gap-5 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={item.id_mk}
                                        >
                                            <div className='overflow-auto text-wrap'>{item.id_konversi}</div>
                                            <div className='overflow-auto text-wrap'>{item.mk_asal}</div>
                                            <div className='ps-3'>{item.sks_asal}</div>
                                            <div className='ps-3'>{item.nilai_asal}</div>
                                            <div className='text-wrap'>{item.mata_kuliah}</div>
                                            <div className='ps-3'>{item.sks}</div>
                                            <div className='ps-3'>{item.nilai_tujuan}</div>
                                            <div className='flex gap-2 items-center justify-start '>
                                                <ActionButton text={"Edit"}>
                                                    <Edit className='cursor-pointer' onClick={() => openModal('edit', item)} />
                                                </ActionButton>
                                                <ActionButton text={"Hapus"} onClick={() => openModal('hapus', item)}>
                                                    <Trash2 className='cursor-pointer' />
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
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Penempatan</h4>
                    </div>
                    <div className='text-sm-3 grid grid-cols-4 gap-2'>
                        <div className='grid grid-cols-1'>
                            <Input.SelectInput width={'100%'} value={mkRemaining} data={["", ""]} label={'Mata Kuliah'} onChange={(e) => {
                                setSemestervalue({ ...semesterValue, mata_kuliah: e.target.value });
                            }}></Input.SelectInput>
                        </div>
                        <div className='grid grid-cols-1'>
                            <Input.SelectInput width={'100%'} data={["", ""]} value={[1, 2, 3, 4, 5, 6, 7, 8]} label={'Semester'} onChange={(e) => {
                                setSemestervalue({ ...semesterValue, semester: e.target.value });
                            }}></Input.SelectInput>
                        </div>
                    </div>
                    <Button className={'margin-auto'} onClick={() => { handleSave() }}>Simpan</Button>
                    <div className='grid grid-cols-1 gap-5 mt-7'>
                        <Tables fields={["No", "Mata kuliah", "SKS", "Semester"]} gap={"2"}>
                            {
                                dataSemester.length !== 0 ? (
                                    dataSemester.map((item, index) => (
                                        <div
                                            className={`grid grid-cols-4 mb-7 text-sm-3 gap-2 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={item.id_semester}
                                        >
                                            <div className='overflow-auto'>{index + 1}</div>
                                            <div>{item.mata_kuliah}</div>
                                            <div>{item.sks}</div>
                                            <div>{item.semester}</div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )
                            }
                        </Tables>
                    </div>
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

            <Modal className={"w-fit"} open={isModalEdit}>
                <Modal.ModalCustom onClose={() => { closeModal('edit') }} title={"Edit Data Mahasiswa"} formClass={'grid grid-cols-2 gap-x-6'} onClick={(e) => { handleAction(e, 'edit'); }} action={true}>
                    <Input.TextInput type={'text'} label={"Mata Kuliah asal"} value={dataKonversi.mk_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'mk_asal', 'edit') }} />
                    <Input.TextInput type={'text'} label={"SKS Asal"} value={dataKonversi.sks_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'sks_asal', 'edit') }} />
                    <Input.TextInput type={'text'} label={"Nilai Asal"} value={dataKonversi.nilai_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'nilai_asal', 'edit') }} />
                    <Input.SelectInput label={"Mata Kuliah Tujuan"} value={mkData} width={"full"} onChange={(e) => { handleSelectedValue(e) }} data={['', dataKonversi.id_mk]}  />
                    <Input.TextInput type={'text'} label={"SKS Tujuan"} value={dataKonversi.sks} width={"full"} onChange={(e) => { handleInputValue(e, 'sks', 'edit') }} read={true} reference={sksRef}/>
                    <Input.TextInput type={'text'} label={"Nilai Tujuan"} value={dataKonversi.nilai_tujuan} width={"full"} onChange={(e) => { handleInputValue(e, 'nilai_tujuan', 'edit') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus hasil konversi?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
        </>
    )
}

export default KonversiDetail