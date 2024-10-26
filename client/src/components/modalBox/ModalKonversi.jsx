import { CircleX, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Form from '../Forms/Form';
import ActionButton from '../Buttons/ActionButton';
import Button from '../Buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addKonversi, clearData, deleteKonversi, updateKonversi } from '../../redux/slices/konversiSlice';
import { postKonversiData } from '../../redux/thunks/apiThunks';

function ModalKonversi({ open, img, data, onClose }) {
    const konversiData = useSelector((state) => state.konversi.data);
    const modalRef = useRef();

    useEffect(() => {
        if (open) {
            modalRef.current.showModal();
        }
    }, [open]);

    if (!open) return null;

    return (
        <dialog className='w-[90%] h-[80%] rounded-lg shadow-md dark:bg-black overflow-hidden' ref={modalRef}>
            <div className='relative w-full'>
                <button onClick={() => { onClose(); }} className="absolute -top-1 -left-1 outline-none w-fit p-0 cursor-pointer bg-transparent">
                    <CircleX className="text-red-600" />
                </button>
            </div>
            <div className='flex gap-10 p-0 h-full'>
                <div className='w-[50%] h-full overflow-auto' style={{ border: "1px solid #CCCCCC" }}>
                    <img src={img} alt="Transkrip Nilai" loading='lazy' className='w-full h-full' />
                </div>
                <div className='w-[45%] overflow-y-auto overflow-x-hidden h-full pe-2'>
                    <h4 className='font-medium text-lg dark:text-slate-200'>Form Konversi</h4>
                    <AkademikFormSection data={data} />
                    {
                        konversiData.length !== 0 ? <PreviewAkademikSection data={data} onClose={onClose}/> : ""
                    }

                </div>
            </div>
        </dialog>
    )
}

const AkademikFormSection = ({ data }) => {
    const dispatch = useDispatch();
    const mkData = useSelector(state => state.konversi.mkData);
    const [value, setValue] = useState({
        mata_kuliah_asal: "",
        mata_kuliah_tujuan: "",
        nilai_asal: "",
        nilai_tujuan: "",
        sks_asal: "",
        sks_tujuan: ""
    });
    const [empty, setEmpty] = useState({
        addPreview: true,
        empty: false
    });

    const handleChange = (e, key, index) => {
        if (key in value) {
            setValue(prevValue => ({
                ...prevValue,
                [key]: e.target.value
            }));
        } else {
            console.warn(`Key '${key}' tidak ditemukan di state 'value'.`);
        }
    }

    const handlePreview = () => {
        const index = mkData.filter(item => item.id_mk === value.mata_kuliah_tujuan);
        const dataAsal = `${value.mata_kuliah_asal}-${value.nilai_asal}-${value.sks_asal}`;
        const dataTujuan = `${index[0].mata_kuliah}-${value.nilai_tujuan}-${value.sks_tujuan}`;
        const obj = {
            dataAsal,
            dataTujuan
        }
        dispatch(addKonversi(obj));
        setEmpty({
            addPreview: true,
            empty: !empty.empty
        });
    }

    return (
        <>
            <div className='mb-5'>
                <Form className='grid grid-cols-2 gap-4 p-1' label={['Nama Mahasiswa', "NIM", "Nama PT Asal", "Fakultas", "Prodi", "Prodi Tujuan"]} data={[data.nama, data.nim, data.pt_asal, data.fakultas, data.prodi, data.prodi_tujuan]} width={"[80%]"} read={true} />
            </div>
            <div className='mb-5'>
                <div className='grid grid-cols-2 gap-5 dark:text-slate-200 mb-5'>
                    <div className='pb-1' style={{ borderBottom: "1px solid #CCCCCC" }}>
                        <h4 className='font-medium'>Kurikulum PT Asal</h4>
                    </div>
                    <div className='pb-1' style={{ borderBottom: "1px solid #CCCCCC" }}>
                        <h4 className='font-medium'>Kurikulum PT Tujuan</h4>
                    </div>
                </div>
                <Form className='grid grid-cols-2 gap-4 p-1' label={['Mata Kuliah Asal', "Mata Kuliah Tujuan", "SKS Asal", 'SKS Tujuan', "Nilai Asal", "Nilai Tujuan"]} data={["", "", "", "", "", ""]} width={"[80%]"} onChange={handleChange} value={value} emptyValue={empty} />
            </div>
            <div className='flex justify-end items-center m-0'>
                <Button text={"Tambahkan ke Preview"} className={"my-5"} onClick={() => {
                    handlePreview();
                }}>
                    <Plus size={16} />
                </Button>
            </div>
        </>
    )
}

const PreviewAkademikSection = ({ data, onClose }) => {
    const dispatch = useDispatch();
    const datakon = useSelector((state) => state.konversi.data);
    const mkData = useSelector(state => state.konversi.mkData);

    const parseData = (data) => {        
        const [mata_kuliah_asal, nilai_asal, sks_asal] = data.dataAsal.split('-');
        const [mata_kuliah_tujuan, nilai_tujuan, sks_tujuan] = data.dataTujuan.split('-') 

        const index = mkData.filter(item => item.mata_kuliah === mata_kuliah_tujuan);

        console.log(data);

        return {
            mata_kuliah_asal,
            nilai_asal,
            sks_asal,
            mata_kuliah_tujuan: index[0].id_mk,
            nilai_tujuan,
            sks_tujuan
        };
    };

    const arr = [];

    datakon.forEach(el => {
        const parse = parseData(el);
        arr.push(parse);
    });

    const handleSave = () => {
        dispatch(postKonversiData({ endpoint: `konversi/add/${data.id_mahasiswa}`, data: { data: arr } }));
        onClose();
    }

    const cancelKonversi = () => {
        dispatch(clearData());
    }

    return (
        <div className='mb-5'>
            <div className='pb-1' style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h4 className='font-medium dark:text-slate-200'>Preview</h4>
            </div>

            <div className='mb-5'>
                <div className='grid grid-cols-2 gap-5 dark:text-slate-200 mb-5 pt-5'>
                    <div className='pb-1' style={{ borderBottom: "1px solid #CCCCCC" }}>
                        <h4 className='font-medium'>Kurikulum PT Asal</h4>
                    </div>
                    <div className='pb-1' style={{ borderBottom: "1px solid #CCCCCC" }}>
                        <h4 className='font-medium'>Kurikulum PT Tujuan</h4>
                    </div>
                </div>
                {
                    datakon ? <PreviewNilaiSection data={datakon} /> : ""
                }
                <div className='flex justify-end gap-2'>
                    <Button text={"Simpan"} className={"mt-7"} onClick={() => handleSave()} />
                    <Button text={"Cancel"} className={"mt-7 bg-red-500 border-red-600"} onClick={cancelKonversi} />
                </div>
            </div>
        </div>
    )
}

const PreviewNilaiSection = ({ data }) => {
    const dispatch = useDispatch();

    const handleChange = (e, key, index) => {
        const newValue = e.target.value;

        dispatch(updateKonversi({
            index: index,
            key,
            value: newValue,
        }));
    }

    const handleDelete = (index) => {
        dispatch(deleteKonversi({ index }));
    }
    
    return (
        <>
            {
                data.map((item, index) => (
                    <div className='mb-5 flex flex-col justify-center' style={{ borderBottom: "1px solid #CCCCCC" }} key={item.dataAsal}>
                        <Form className='grid grid-cols-2 gap-5 p-1' label={["", ""]} data={[item.dataAsal, item.dataTujuan]} width={"[85%]"} onChange={handleChange} dataIndex={index} />
                        <div className='flex gap-1 justify-end items-center mt-5 pe-5'>
                            <ActionButton text={"Hapus"} onClick={() => { handleDelete(index) }} >
                                <Trash2 className='cursor-pointer' />
                            </ActionButton>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default ModalKonversi;