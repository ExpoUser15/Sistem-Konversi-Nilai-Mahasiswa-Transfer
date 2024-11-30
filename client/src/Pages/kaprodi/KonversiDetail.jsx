import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Buttons/Button';
import Tables from '../../components/Tables/Tables';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, fetchKonversiData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/Loader/Loading';
import ActionButton from '../../components/Buttons/ActionButton';
import { Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/ModalBox/Modal';
import Input from '../../components/Inputs/Input';
import { useSelectedProperties } from '../../hooks/useGetSelectedProperty';
import axios from 'axios';
import useDownload from '../../hooks/useDownload';
import Notification from '../../components/Notifications/Notification';
import RcPagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { insertData } from '../../redux/slices/konversiSlice';
import { formattedDate } from '../../utils/formattedDate';
import moment from 'moment';

const locale = {
    prev_page: 'Previous',
    next_page: 'Next',
    jump_to: 'Go to',
    jump_to_confirm: 'Confirm',
    page: 'Page',
    items_per_page: 'items/page',
};

const ITEMS_PER_PAGE = 5;

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
    const [isDeletePenempatanModal, setIsDeletePenempatanModal] = useState(false);
    const [isDeleteTabelModal, setIsDeleteTabelModal] = useState(false);
    const [dataKonversi, setDataKonversi] = useState(false);
    const [dataMataKuliah, setDataMataKuliah] = useState([]);
    const [value, setValue] = useState('');

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [action, setAction] = useState('');

    const [dataSemester, setDataSemester] = useState([]);
    const [dataRecap, setDataRecap] = useState({});
    const [spesifikSemesterData, setSpesifikSemesterData] = useState([]);
    const [semester, setSemester] = useState(null);
    const [mkRemaining, setMkRemaining] = useState([]);
    const [semesterValue, setSemestervalue] = useState({
        mata_kuliah: '',
        semester: ''
    });

    // paginasi logic
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = data.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const sksRef = useRef();
    const semesterRef = useRef();

    const penempatanSelectRef = useRef();
    const mkPenempatanRef = useRef();

    const totalSKSRef = useRef();
    const mkTempuhRef = useRef();

    const tanggalRef = useRef();

    const editMKTujuanRef = useRef();

    useEffect(() => {
        dispatch(fetchKonversiData({ endpoint: `konversi/detail/${id_mahasiswa}` }));
        dispatch(fetchData({ endpoint: `matakuliah` }));
    }, [dispatch]);

    useEffect(() => {
        axios.get(`http://localhost:3000/konversi/recap/${id_mahasiswa}`)
            .then(res => {
                const { data } = res;
                setDataRecap(data.data);
            }).catch(err => console.log(err));

        axios.get(`http://localhost:3000/konversi/semester/${id_mahasiswa}`)
            .then(res => {
                const { data } = res;
                setDataSemester(data.data);
                if (data.data.length !== 0) {
                    setSemester(data.data[0][0].penempatan);
                    semesterRef.current.value = data.data[data.data.length - 1][0].penempatan;
                } else {
                    semesterRef.current.value = 'Data Not Available';
                }
            }).catch(err => console.log(err));

        axios.get(`http://localhost:3000/konversi/penempatan/${id_mahasiswa}`)
            .then(res => {
                let data = res.data.data.map(item => {
                    return {
                        mata_kuliah: `${item.mata_kuliah} (${item.semester})`,
                        id_mk: item.id_mk
                    }
                });

                setDataMataKuliah(data);
            }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        semesterRef.current.value = dataSemester.length !== 0 ? dataSemester[0][0].penempatan : '';
    }, [dataSemester]);

    useEffect(() => {
        totalSKSRef.current.value = `${dataRecap.total_hasil_konversi}/${dataRecap.total_sks_tujuan} SKS`;
        mkTempuhRef.current.value = `${dataRecap.sisa_mk}`;
        tanggalRef.current.value = `${formattedDate(dataRecap.tanggal)}`;

        totalSKSRef.current.style.cursor = 'not-allowed';
        mkTempuhRef.current.style.cursor = 'not-allowed';
        semesterRef.current.style.cursor = 'not-allowed';
        tanggalRef.current.style.cursor = '';
    }, [dataRecap]);

    useEffect(() => {
        if (data.length === 0) navigate('/kaprodi/riwayat');
    }, [data]);

    const openModal = (cek, item) => {
        if (cek === 'edit') {
            setIsModalEdit(true);
            setDataKonversi(item);
        }

        if (cek === 'hapus') {
            setIsDeleteModal(true);
            setDataKonversi(item);
        }

        if (cek === 'hapus penempatan') {
            setIsDeletePenempatanModal(true);
            setDataKonversi(item);
        }
        if (cek === 'hapus tabel') {
            setIsDeleteTabelModal(true);
            setDataKonversi(item);
            console.log(item)
        }
    }

    const closeModal = () => {
        setIsDeleteModal(false);
        setIsModalEdit(false);
        setIsDeletePenempatanModal(false);
        setIsDeleteTabelModal(false);
    }

    const handleInputValue = async (e, item) => {
        const inputvalue = e.target.value;

        setValue({
            ...value,
            [item]: inputvalue
        });
    }

    useEffect(() => {
        if (isModalEdit) {
            editMKTujuanRef.current.value = dataKonversi.id_mk;
        }
    }, [isModalEdit]);

    const handleSelectedValue = (e) => {
        if (sksRef.current.value === "") {
            sksRef.current.value === ""
            return;
        }

        handleInputValue(e, 'id_mk', 'edit');
        const findData = mkData.findIndex(item => e.target.value === item.id_mk);
        if (findData !== -1) {
            sksRef.current.value = String(mkData[findData].sks);
        }
    }

    const handleAction = async (e, actionType, item) => {
        e.preventDefault();
        setStatus('');
        setMessage('');
        setAction('');
        await new Promise(resolve => setTimeout(resolve, 0));
        if (actionType === 'hapus') {
            axios.delete(`http://localhost:3000/konversi/detail/delete/${dataKonversi.id_konversi}/${id_mahasiswa}`)
                .then(res => {
                    const { data } = res;
                    setDataRecap(data.recapData);
                    dispatch(insertData(data.data));
                    setStatus(res.data.status);
                    setMessage(res.data.message);
                    setAction(true);
                    setDataMataKuliah(mkData);
                }).catch(err => console.log(err));

            setIsDeleteModal(false);
        }

        if (actionType === 'edit') {
            const selectedProperties = useSelectedProperties(dataKonversi, ['id_konversi', 'mk_asal', 'sks_asal', 'nilai_asal', 'id_mk', 'sks', 'nilai_tujuan']);
            const updatedData = {
                ...selectedProperties,
                ...value
            }

            axios.put(`http://localhost:3000/konversi/detail/${id_mahasiswa}`, updatedData)
                .then(res => {
                    const { data } = res;
                    setDataRecap(data.recapData);
                    dispatch(insertData(data.data));
                    setStatus(res.data.status);
                    setMessage(res.data.message);
                    setAction(true);
                }).catch(err => console.log(err));

            setIsModalEdit(false);
            setValue({});
        }

        if (actionType === 'hapus penempatan') {
            penempatanSelectRef.current.value = "";
            setMkRemaining([]);
            axios.delete(`http://localhost:3000/konversi/semester/delete/${dataKonversi.kode}/${id_mahasiswa}/${semester}`)
                .then(res => {
                    setStatus(res.data.status);
                    setMessage(res.data.message);
                    setAction(true);
                    setDataSemester(res.data.data);

                    const penempatanIndex = res.data.data.findIndex(item => item[0].penempatan === semester);
                    if (penempatanIndex === -1) {
                        setSpesifikSemesterData([]);
                        setSemester(res.data.data[0][0].penempatan);
                    }

                    if (spesifikSemesterData.length !== 0) {
                        const findIndex = res.data.data.findIndex(item => item[0].penempatan === semester);
                        if (findIndex !== -1) {
                            setSpesifikSemesterData(res.data.data[findIndex]);
                        } else {
                            setSpesifikSemesterData([]);
                        }
                    }

                    let mkData = res.data.mkData.map(item => {
                        return {
                            mata_kuliah: `${item.mata_kuliah} (${item.semester})`,
                            id_mk: item.id_mk
                        }
                    });

                    setDataMataKuliah(mkData);
                }).catch(err => {
                    setAction(true);
                    setStatus(err.response?.data.status);
                    setMessage(err.response?.data.message);
                });
            setIsDeletePenempatanModal(false);
        }

        if (actionType === 'hapus tabel') {
            penempatanSelectRef.current.value = "";
            setMkRemaining([]);
            axios.delete(`http://localhost:3000/konversi/semester/tabel/delete/${dataKonversi}/${id_mahasiswa}`)
                .then(res => {
                    setStatus(res.data.status);
                    setMessage(res.data.message);
                    setAction(true);
                    setDataSemester(res.data.data);
                    if (res.data.data.length === 0) {
                        setSpesifikSemesterData([]);
                    } else {
                        setSpesifikSemesterData(res.data.data[0]);

                        setSemester(res.data.data[0][0].penempatan);
                    }

                    let mkData = res.data.mkData.map(item => {
                        return {
                            mata_kuliah: `${item.mata_kuliah} (${item.semester})`,
                            id_mk: item.id_mk
                        }
                    });

                    setDataMataKuliah(mkData);
                }).catch(err => {
                    setAction(true);
                    setStatus(err.response?.data.status);
                    setMessage(err.response?.data.message);
                });
            setIsDeleteTabelModal(false);
        }
    }

    const handleSave = () => {
        setStatus('');
        setMessage('');
        setAction(false);
        axios.post(`http://localhost:3000/konversi/semester/add/${id_mahasiswa}`, semesterValue, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                setStatus(res.data.status);
                setMessage(res.data.message);
                setAction(true);
                setSemestervalue({
                    mata_kuliah: '',
                    semester: ''
                });
                if(res.data.mkData !== 0){
                    setDataSemester(res.data.data);
                    setMkRemaining([]);
                    let mkData = res.data.mkData.map(item => {
                        return {
                            mata_kuliah: `${item.mata_kuliah} (${item.semester})`,
                            id_mk: item.id_mk
                        }
                    });
    
                    setDataMataKuliah(mkData);
                }else{
                    setDataMataKuliah([]);
                }


                penempatanSelectRef.current.value = "";
                if (spesifikSemesterData.length !== 0) {
                    const findIndex = res.data.data.findIndex(item => item[0].penempatan === semesterValue.semester);
                    setSpesifikSemesterData(res.data.data[findIndex]);
                }
            }).catch(err => {
                console.log(err);
                setStatus(err.response?.data.status);
                setMessage(err.response?.data.message);
                setAction(true);
                setMkRemaining([]);
                penempatanSelectRef.current.value = "";
            });

    }

    const handleSemesterMenu = (index) => {
        setSpesifikSemesterData(dataSemester[index]);
        setSemester(dataSemester[index][0].penempatan);
    }

    const handleSelectedMK = () => {
        if (!penempatanSelectRef.current.value) {
            setMkRemaining([]);
            return;
        }

        const num = Number(penempatanSelectRef.current.value);

        let evenCourses;
        if (num % 2 === 0) {
            evenCourses = dataMataKuliah.filter(item => {
                const split = item.mata_kuliah.match(/\d+/g);

                if (split) {
                    const mataKuliahNum = Number(split[0]);
                    return mataKuliahNum % 2 === 0 && mataKuliahNum <= num;
                }

                return false;
            });
        } else {
            evenCourses = dataMataKuliah.filter(item => {
                const split = item.mata_kuliah.match(/\d+/g);

                if (split) {
                    const mataKuliahNum = Number(split[0]);
                    return mataKuliahNum % 2 !== 0 && mataKuliahNum <= num;
                }

                return false;
            });
        }
        setMkRemaining(evenCourses);
    };

    const handleEditTanggal = () => {
        setStatus('');
        setMessage('');
        setAction(false);
        const value = tanggalRef.current.value;
        const formattedDate = moment(value, 'DD MMMM YYYY').format('YYYY-MM-DD');
        if (value === "") {
            setStatus('Warning');
            setMessage('Tanggal tidak boleh kosong.');
            setAction(true);
            return;
        }

        axios.put(`http://localhost:3000/konversi/update/date/${id_mahasiswa}`, {
            tanggal: formattedDate
        }).then(res => {
            setStatus(res.data.status);
            setMessage(res.data.message);
            setAction(true);
        }).catch(err => {
            setStatus(err.response?.data.status);
            setMessage(err.response?.data.message);
            setAction(true);
        })
    }

    const goBack = () => {
        navigate(-1);
    };

    const downloadFile = useDownload();

    const handleGeneratePDF = () => {
        axios.get(`http://localhost:3000/file/report/${id_mahasiswa}`, {
            responseType: 'blob'
        })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const filename = `laporan_${nama}_${btoa(nama)}.pdf`;
                downloadFile(url, filename);
            });
    }

    const notifRef = useRef();

    return (
        <>
            <Notification
                text={message ? message : messageKonversi}
                status={status ? status : statusKonversi}
                state={action ? action : actionKonversi}
                notifRef={notifRef}
            />
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Detail Konversi {nama}</h3>
            </div>
            <main className="my-16">
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Rekapitulasi</h4>
                    </div>
                    <div className='text-sm-3 grid grid-cols-1 sm:grid-cols-5'>
                        <div className='grid grid-cols-1'>
                            <Input.TextInput label={'Mata Kuliah/SKS'} width={'sm:w-32 w-42'} read={true} reference={totalSKSRef} ></Input.TextInput>
                        </div>
                        <div className='grid grid-cols-1'>
                            <Input.TextInput label={'MK yang harus ditempuh'} width={'sm:w-32 w-42'} read={true} reference={mkTempuhRef} ></Input.TextInput>
                        </div>
                        <div className='grid grid-cols-1'>
                            <Input.TextInput
                                label={'Penempatan Semester'}
                                width={'sm:w-32 w-42'}
                                reference={semesterRef}
                                read={true}
                            />
                        </div>
                        <div className='flex flex-row gap-2'>
                            <div>
                                <Input.TextInput
                                    label={'Tanggal'}
                                    width={'w-32'}
                                    reference={tanggalRef}
                                    read={false}
                                />
                            </div>
                            <Button className={'w-fit h-fit text-nowrap self-center'} onClick={() => { handleEditTanggal(); }}>Edit Tanggal</Button>
                        </div>
                    </div>
                </div>
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Detail Konversi</h4>
                    </div>
                    <Tables fields={["No", "Mata Kuliah Asal", "SKS Asal", "Nilai Asal", "Mata Kuliah Tujuan", "SKS Tujuan", "Nilai Tujuan", ""]} gap={"5"}>
                        {
                            !loading ?
                                currentData
                                    .map((item, index) => (
                                        <div
                                            className={`min-w-[700px] sm:max-h-fit grid grid-cols-8 mb-7 text-sm-3 gap-5 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={btoa(String(index))}
                                        >
                                            <div className='flex items-center justify-start  overflow-auto text-wrap'>{startIndex + index + 1}</div>
                                            <div className='flex items-center justify-start  overflow-auto text-wrap'>{item.mk_asal}</div>
                                            <div className='flex items-center justify-start'>{item.sks_asal}</div>
                                            <div className='flex items-center justify-start'>{item.nilai_asal}</div>
                                            <div className='flex items-center justify-start text-wrap'>{item.mata_kuliah}</div>
                                            <div className='flex items-center justify-start'>{item.sks}</div>
                                            <div className='flex items-center justify-start'>{item.nilai_tujuan}</div>
                                            <div className='flex items-center justify-start '>
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
                    <RcPagination
                        current={currentPage}
                        total={data.length}
                        pageSize={ITEMS_PER_PAGE}
                        onChange={handlePageChange}
                        showQuickJumper
                        locale={locale}
                        showLessItems={true}
                    />
                </div>
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Penempatan</h4>
                    </div>
                    <div className='text-sm-3 grid grid-col-1 sm:grid-cols-4 gap-2 mb-7'>
                        <div className='grid grid-cols-1'>
                            <Input.SelectInput reference={mkPenempatanRef} width={'100%'} value={mkRemaining} data={["", ""]} label={'Mata Kuliah'} onChange={(e) => {
                                setSemestervalue({ ...semesterValue, mata_kuliah: e.target.value });
                            }}></Input.SelectInput>
                        </div>
                        <div className='grid grid-cols-1'>
                            <Input.SelectInput width={'100%'} data={["", ""]} value={[1, 2, 3, 4, 5, 6, 7]} label={'Semester'} reference={penempatanSelectRef} onChange={(e) => {
                                setSemestervalue({ ...semesterValue, semester: e.target.value }); handleSelectedMK();
                            }}></Input.SelectInput>
                        </div>
                        <Button className={'margin-auto h-fit w-fit my-auto'} onClick={() => { handleSave() }}>Simpan</Button>
                    </div>

                    {
                        dataSemester.length !== 0 ? (
                            <div className="text-sm-3 grid grid-cols-2 sm:grid-cols-12">
                                {
                                    dataSemester.map((item, index) => (
                                        <Button key={item[0].penempatan} className={'sm:col-span-2 margin-auto h-fit w-fit my-auto bg-slate-600 border-slate-500 text-nowrap'} onClick={() => { handleSemesterMenu(index) }}>Semester {item[0].penempatan}</Button>
                                    ))
                                }
                            </div>
                        ) : (
                            ''
                        )
                    }
                    {
                        dataSemester.length !== 0 ? (
                            <div className='grid grid-cols-1 gap-5 mt-7'>
                                <h4 className="font-medium mt-4 mb-0">Semester {spesifikSemesterData.length === 0 ? dataSemester[0][0].penempatan : spesifikSemesterData[0].penempatan}</h4>
                                <Tables fields={["No", "Mata kuliah", "SKS", "Semester", ""]} gap={"2"}>
                                    {
                                        spesifikSemesterData.length === 0 ? (
                                            dataSemester[0].map((item, index) => (
                                                <div
                                                    className={`min-w-[700px] sm:max-h-fit grid grid-cols-5 mb-7 text-sm-3 gap-5 pb-2`}
                                                    style={{ borderBottom: "1px solid #CCCCCC" }}
                                                    key={item.kode}
                                                >
                                                    <div className='overflow-auto'>{index + 1}</div>
                                                    <div>{item.mata_kuliah}</div>
                                                    <div>{item.sks}</div>
                                                    <div>{item.semester}</div>
                                                    <ActionButton text={"Hapus"} onClick={() => openModal('hapus penempatan', item)}>
                                                        <Trash2 className='cursor-pointer' />
                                                    </ActionButton>
                                                </div>
                                            ))
                                        ) : (
                                            spesifikSemesterData.map((item, index) => (
                                                <div
                                                    className={`grid grid-cols-5 mb-7 text-sm-3 gap-2 pb-2`}
                                                    style={{ borderBottom: "1px solid #CCCCCC" }}
                                                    key={item.id_semester}
                                                >
                                                    <div className='overflow-auto'>{index + 1}</div>
                                                    <div>{item.mata_kuliah}</div>
                                                    <div>{item.sks}</div>
                                                    <div>{item.semester}</div>
                                                    <ActionButton text={"Hapus"} onClick={() => openModal('hapus penempatan', item)}>
                                                        <Trash2 className='cursor-pointer' />
                                                    </ActionButton>
                                                </div>
                                            ))
                                        )
                                    }
                                    {
                                        spesifikSemesterData.length === 0 ? (
                                            <div className={`grid grid-cols-5 mb-7 text-sm-3 gap-2 pb-2`} style={{ borderBottom: '1px solid white' }}>
                                                <div className='col-span-2 font-semibold'>Total SKS</div>
                                                <div className='col-span-1 font-semibold'>{dataSemester[0][dataSemester[0].length - 1].totalSKS}</div>
                                            </div>
                                        ) : (
                                            <div className={`grid grid-cols-5 mb-7 text-sm-3 gap-2 pb-2`} style={{ borderBottom: '1px solid white' }}>
                                                <div className='col-span-2 font-semibold'>Total SKS</div>
                                                <div className='col-span-1 font-semibold'>{spesifikSemesterData[spesifikSemesterData.length - 1].totalSKS}</div>
                                            </div>
                                        )
                                    }
                                </Tables>
                                <Button className={'ms-auto h-fit w-fit mb-10 bg-red-500 border-red-500'} onClick={() => { openModal('hapus tabel', spesifikSemesterData.length === 0 ? dataSemester[0][0].penempatan : spesifikSemesterData[0].penempatan) }}>Hapus Tabel Semester {spesifikSemesterData.length === 0 ? dataSemester[0][0].penempatan : spesifikSemesterData[0].penempatan}</Button>
                            </div>
                        ) : (
                            <></>
                        )
                    }

                    <div className='flex gap-2 mb-2'>
                        {
                            dataSemester.length !== 0 ? (
                                <>
                                    <Button onClick={handleGeneratePDF}>
                                        Generate PDF
                                    </Button>
                                    <Button onClick={goBack} className={'bg-red-500 border-red-500'}>
                                        Kembali
                                    </Button>
                                </>
                            ) : ""
                        }
                    </div>
                </div>
            </main>

            <Modal className={"w-fit"} open={isModalEdit}>
                <Modal.ModalCustom onClose={() => { closeModal('edit') }} title={"Edit Data Mahasiswa"} formClass={'grid grid-cols-2 gap-x-6'} onClick={(e) => { handleAction(e, 'edit'); }} action={true}>
                    <Input.TextInput type={'text'} label={"Mata Kuliah asal"} value={dataKonversi.mk_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'mk_asal', 'edit') }} read={false} />
                    <Input.TextInput type={'text'} label={"SKS Asal"} value={dataKonversi.sks_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'sks_asal', 'edit') }} />
                    <Input.TextInput type={'text'} label={"Nilai Asal"} value={dataKonversi.nilai_asal} width={"full"} onChange={(e) => { handleInputValue(e, 'nilai_asal', 'edit') }} />
                    <Input.SelectInput label={"Mata Kuliah Tujuan"} value={mkData} width={"full"} onChange={(e) => { handleSelectedValue(e) }} data={['', dataKonversi.id_mk]} reference={editMKTujuanRef} />
                    <Input.TextInput label={"SKS Tujuan"} value={dataKonversi.sks} width={"full"} onChange={(e) => { handleInputValue(e, 'sks', 'edit') }} reference={sksRef} read={true} />
                    <Input.TextInput type={'text'} label={"Nilai Tujuan"} value={dataKonversi.nilai_tujuan} width={"full"} onChange={(e) => { handleInputValue(e, 'nilai_tujuan', 'edit') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeleteModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus hasil konversi?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeletePenempatanModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus penempatan'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
            <Modal open={isDeleteTabelModal}>
                <Modal.ModalCustom onClose={() => { closeModal('hapus') }} title={`Apakah anda yakin ingin menghapus tabel semester?`} formClass={'flex gap-2'}>
                    <Button text={"Hapus"} className={"mt-2 ms-auto w-full justify-center"} onClick={(e) => { handleAction(e, 'hapus tabel'); }} />
                    <Button text={"Batal"} className={"mt-2 ms-auto  bg-red-500 border-red-600 w-full text-center justify-center"} onClick={(e) => { e.preventDefault(); closeModal('hapus') }} />
                </Modal.ModalCustom>
            </Modal>
        </>
    )
}

export default KonversiDetail