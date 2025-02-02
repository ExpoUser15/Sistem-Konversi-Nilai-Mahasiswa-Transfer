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
import { formattedDate } from '../../utils/formattedDate';
import useCompressedImage from '../../hooks/useCompressedImage';
import RcPagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

const locale = {
    prev_page: 'Previous',
    next_page: 'Next',
    jump_to: 'Go to',
    jump_to_confirm: 'Confirm',
    page: 'Page',
    items_per_page: 'items/page',
};

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE2 = 10;

function Mahasiswa() {
    const dispatch = useDispatch();
    const students = useSelector(state => state.apiData.data);
    const loading = useSelector(state => state.apiData.loading);
    const action = useSelector(state => state.apiData.action);
    const message = useSelector(state => state.apiData.message);
    const status = useSelector(state => state.apiData.status);

    const notifRef = useRef();

    const [dataMahasiswa, setDataMahasiswa] = useState({});
    const [value, setValue] = useState({});
    const [berkasName, setBerkasName] = useState("");
    const [spesifikBerkas, setSpesifikBerkas] = useState({});
    const [jenisFile, setJenisFile] = useState("");
    const [nama, setNama] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [isModalTambah, setIsModalTambah] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'mahasiswa/all' }));
    }, [dispatch]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);

    const studentsPending = students.filter(item => item.status === "Pending").sort((a, b) =>  new Date(b.tanggal) - new Date(a.tanggal));
    const studentsConverted = students.filter(item => item.status === "Converted").sort((a, b) =>  new Date(b.tanggal) - new Date(a.tanggal));

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentDataPending = studentsPending.slice(startIndex, endIndex);

    const startIndex2 = (currentPage2 - 1) * ITEMS_PER_PAGE2;
    const endIndex2 = startIndex2 + ITEMS_PER_PAGE2;
    const currentDataConverted = studentsConverted.slice(startIndex2, endIndex2);

    const openModal = (item, item2, file) => {
        if (item === "detail") {
            setIsModalDetail(true)
            setDataMahasiswa(item2);
            return;
        }

        if (item === 'edit') {
            setIsModalEdit(true)
            setDataMahasiswa(item2);
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

    const closeModal = () => {
        setIsModalTambah(false);
        setIsModalEdit(false);
        setIsModalDetail(false);
        setIsDeleteModal(false);
        setIsModalOpen(false);
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

        let fileOrText;
        if (file) {
            fileOrText = await useCompressedImage(e);
        } else {
            fileOrText = inputvalue; 
        }

        const addData = {
            ...value,
            [item]: fileOrText
        }
        setValue(addData);
    }

    const handleAction = async (e, actionType) => {
        e.preventDefault();
        await new Promise(resolve => setTimeout(resolve, 0));
        if (actionType === 'tambah') {
            const formData = new FormData();

            for (let key in value) {
                formData.append(key, value[key]);
            }

            dispatch(postData({ endpoint: 'mahasiswa/add', data: formData, contentType: 'multipart/form-data' }));
            setIsModalTambah(false);
        }

        if (actionType === 'hapus') {
            dispatch(deleteData({ endpoint: `mahasiswa/delete/${dataMahasiswa.id_mahasiswa}` }));
            setIsDeleteModal(false);
        }

        if (actionType === 'edit') {
            const selectedProperties = useSelectedProperties(dataMahasiswa, ['nama', 'email', 'nim', 'fakultas', 'prodi', 'prodi_tujuan', 'pt_asal']);
            const updatedData = {
                ...selectedProperties,
                ...value
            }
            dispatch(updateData({ endpoint: `mahasiswa/update/${dataMahasiswa.id_mahasiswa}`, data: updatedData }));
            setIsModalEdit(false);
            setValue({});
        }

        if (actionType === 'patch') {
            const formData = new FormData();
            const key = Object.keys(spesifikBerkas)[0];
            const compress = await useCompressedImage(spesifikBerkas[key]);
            formData.append(key, compress);
            dispatch(patchData({ endpoint: `mahasiswa/update/${dataMahasiswa.id_mahasiswa}/berkas/${dataMahasiswa.id_berkas}`, data: formData, contentType: 'multipart/form-data' }));
            setIsModalOpen(false);
            setSpesifikBerkas({});
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageChange2 = (page) => {
        setCurrentPage2(page);
    };

    return (
        <>
            <Notification
                text={message}
                status={status}
                state={action}
                notifRef={notifRef}
            />
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Mahasiswa</h3>
            </div>
            {/* Table */}
            <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between sm:mb-5 mb-10">
                    <h4 className="font-medium">Pengajuan Konversi</h4>
                    <SearchField placeholder={"Cari..."} searchType={'mahasiswa'}/>
                </div>
                <Tables fields={["Nama", "Tanggal", "Berkas", "Transkrip", "Surat Pindah", "Detail", "Status", ""]} gap={"5"}>
                    {
                        !loading ?
                            currentDataPending
                                .map((item, index) => (
                                    <div
                                        className={`min-w-[700px] sm:max-h-fit grid grid-cols-8 mb-7 text-sm-3 gap-5 pb-2`}
                                        style={{ borderBottom: "1px solid #CCCCCC" }}
                                        key={item.id_mahasiswa}
                                    >
                                        <div className='overflow-auto'>{item.nama}</div>
                                        <div>{formattedDate(item.tanggal)}</div>
                                        <div
                                            className="cursor-pointer"
                                        >

                                            <ActionButton text={"Lihat Berkas"}  onClick={() => { openModal([item.ktp, item.kk, item.ijazah], item.nama, ["KTP", "KK", "Ijazah"]); setDataMahasiswa(item); }}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                        >
                                            <ActionButton text={"Lihat Transkrip"} 
                                            onClick={() => { openModal(item.transkrip_nilai, item.nama, "Transkrip Nilai"); setDataMahasiswa(item); }}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                        >
                                            <ActionButton text={"Lihat Surat Pindah"} 
                                            onClick={() => { openModal(item.surat_pindah, item.nama, "Surat Pindah"); setDataMahasiswa(item); }}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                        >
                                            <ActionButton text={"Lihat Detail"} 
                                            onClick={() => { openModal('detail', item); setDataMahasiswa(item); }}>
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
                                            <ActionButton text={"Edit"} onClick={() => openModal('edit', item)}>
                                                <Edit className='cursor-pointer' />
                                            </ActionButton>
                                            <ActionButton text={"Hapus"} onClick={() => { openModal('hapus', item); }}>
                                                <Trash2 className='cursor-pointer' />
                                            </ActionButton>
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
                <div className='flex mt-8'>
                    <RcPagination
                        current={currentPage}
                        total={studentsPending.length}
                        pageSize={ITEMS_PER_PAGE}
                        onChange={handlePageChange}
                        showQuickJumper
                        locale={locale}
                        showLessItems={true}
                        hideOnSinglePage={true}
                    />
                    <Button text={"Tambah"} className={"ms-auto"} onClick={(e) => { e.preventDefault(); openModal("tambah"); }} />
                </div>
            </div>
            <div className='mb-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700'>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between sm:mb-5 mb-10">
                    <h4 className="font-medium">Daftar Mahasiswa Transfer</h4>
                    <SearchField placeholder={"Cari..."} searchType={"mahasiswa"}/>
                </div>
                <Tables fields={["Nama", "Tanggal", "Berkas", "Transkrip", "Surat Pindah", "Detail", "Status", ""]} gap={"5"}>
                    {
                        students.length > 0 ?
                            currentDataConverted
                                .map((item, index) => (
                                    <div
                                        className={`min-w-[700px] sm:max-h-fit grid grid-cols-8 mb-7 text-sm-3 gap-5 pb-2`}
                                        style={{ borderBottom: "1px solid #CCCCCC" }}
                                        key={item.id_mahasiswa}
                                    >
                                        <div className='overflow-auto'>{item.nama}</div>
                                        <div>{formattedDate(item.tanggal)}</div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {openModal([item.ktp, item.kk, item.ijazah], item.nama, ["KTP", "KK", "Ijazah"]); setDataMahasiswa(item);}}
                                        >

                                            <ActionButton text={"Lihat Berkas"}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {openModal(item.transkrip_nilai, item.nama, "Transkrip Nilai"); setDataMahasiswa(item);}}
                                        >
                                            <ActionButton text={"Lihat Transkrip"}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {openModal(item.surat_pindah, item.nama, "Surat Pindah"); setDataMahasiswa(item);}}
                                        >
                                            <ActionButton text={"Lihat Surat Pindah"}>
                                                <Eye className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => openModal('detail', item)}
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
                                            <ActionButton text={"Edit"} onClick={() => openModal('edit', item)}>
                                                <Edit className='cursor-pointer' />
                                            </ActionButton>
                                            <ActionButton text={"Hapus"} onClick={() => openModal('hapus', item)}>
                                                <Trash2 className='cursor-pointer' />
                                            </ActionButton>
                                        </div>
                                    </div>

                                ))
                                .concat(
                                    students.filter(item => item.status === "Converted").length === 0 ? (
                                        <div className='grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2' key="empty">
                                            <p className='text-center col-span-10 italic'>Data Kosong</p>
                                        </div>
                                    ) : []
                                )
                            : (
                                <div className={`grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2`}>
                                    <p className='text-center col-span-10 italic'>Data Kosong</p>
                                </div>
                            )
                    }
                </Tables>
                <div className="flex mt-8">
                    <RcPagination
                        current={currentPage2}
                        total={studentsConverted.length}
                        pageSize={ITEMS_PER_PAGE2}
                        onChange={handlePageChange2}
                        showQuickJumper
                        locale={locale}
                        showLessItems={true}
                        hideOnSinglePage={true}
                    />
                </div>
            </div>
            <Modal className={"w-[550px]"} open={isModalOpen}>
                <Modal.ModalBerkas src={berkasName} onClose={closeModal} onClick={(e) => { handleAction(e, 'patch'); }} nama={nama} file={jenisFile} setSpesifikBerkas={setSpesifikBerkas} />
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
            <Modal className={"w-fit"} open={isModalTambah}>
                <Modal.ModalCustom onClose={() => { closeModal('tambah') }} title={"Tambah Mahasiswa"} formClass={'grid grid-cols-2 gap-x-6'} action={true} onClick={(e) => { handleAction(e, 'tambah'); }}>
                    <Input label={"Nama"} width={"full"} type={'text'} inputName={"nama"} onChange={(e) => { handleInputValue(e, 'nama', 'tambah') }} />
                    <Input label={"NIM"} width={"full"} type={'text'} inputName={"nim"} onChange={(e) => { handleInputValue(e, 'nim', 'tambah') }} />
                    <Input label={"Email"} width={"full"} type={'text'} inputName={"email"} onChange={(e) => { handleInputValue(e, 'email', 'tambah') }} />
                    <Input label={"PT Asal"} width={"full"} type={'text'} inputName={"pt_asal"} onChange={(e) => { handleInputValue(e, 'pt_asal', 'tambah') }} />
                    <Input label={"Fakultas"} width={"full"} type={'text'} inputName={"fakultas"} onChange={(e) => { handleInputValue(e, 'fakultas', 'tambah') }} />
                    <Input label={"Prodi"} width={"full"} type={'text'} inputName={"prodi"} onChange={(e) => { handleInputValue(e, 'prodi', 'tambah') }} />
                    <Input label={"Prodi Tujuan"} width={"full"} type={'text'} inputName={"prodi_tujuan"} onChange={(e) => { handleInputValue(e, 'prodi_tujuan') }} />
                    <Input type={"file"} label={'KK'} inputName={'kk'} onChange={(e) => { handleInputValue(e, 'kk', 'tambah', true) }} extensi={'.png, .jpg, .jpeg'}/>
                    <Input type={"file"} label={'KTP'} inputName={'ktp'} onChange={(e) => { handleInputValue(e, 'ktp', 'tambah', true) }} extensi={'.png, .jpg, .jpeg'}/>
                    <Input type={"file"} label={'Ijazah'} inputName={'ijazah'} onChange={(e) => { handleInputValue(e, 'ijazah', 'tambah', true) }} extensi={'.png, .jpg, .jpeg'}/>
                    <Input type={"file"} label={'Surat Pindah'} inputName={'sp'} onChange={(e) => { handleInputValue(e, 'surat_pindah', 'tambah', true) }} extensi={'.png, .jpg, .jpeg'}/>
                    <Input type={"file"} label={'Transkrip Nilai'} inputName={'transkrip'} onChange={(e) => { handleInputValue(e, 'transkrip', 'tambah', true) }} />
                    <div className='col-span-2 rounded-md'>
                        <p className='italic text-sm-3 text-white' style={{fontSize: "12px"}}>Catatan: Berkas yang dimasukan harus berupa .PNG, .JPG, atau .JPEG.</p>
                    </div>
                </Modal.ModalCustom>
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

export default Mahasiswa