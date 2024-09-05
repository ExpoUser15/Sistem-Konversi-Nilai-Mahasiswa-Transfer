import { CircleX, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Form from '../forms/Form';
import ActionButton from '../buttons/ActionButton';
import Button from '../buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addKonversi, clearData, deleteKonversi, updateKonversi } from '../../redux/slices/konversiSlice';

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
                <button onClick={() => { onClose("konversi"); }} className="absolute -top-1 -left-1 outline-none w-fit p-0 cursor-pointer bg-transparent">
                    <CircleX className="text-red-600" />
                </button>
            </div>
            <div className='flex gap-10 p-0 h-full'>
                <div className='w-[50%] h-full overflow-auto' style={{ border: "1px solid #CCCCCC" }}>
                    <img src={img} alt="Transkrip Nilai" loading='lazy' className='w-full h-full' />
                </div>
                <div className='w-[45%] overflow-y-auto overflow-x-hidden h-full pe-5'>
                    <h4 className='font-medium text-lg dark:text-slate-200'>Form Konversi</h4>
                    <AkademikFormSection data={data} />
                    {
                        konversiData.length !== 0 ? <PreviewAkademikSection /> : ""
                    }

                </div>
            </div>
        </dialog>
    )
}

const AkademikFormSection = ({ data }) => {
    const dispatch = useDispatch();
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

    const handleChange = (e, key) => {
        if (key in value) {
            setValue(prevValue => ({
                ...prevValue,
                [key]: e.target.value
            }));
        } else {
            console.warn(`Key '${key}' tidak ditemukan di state 'value'.`);
        }
    }

    return (
        <>
            <div className='mb-5'>
                <Form className='grid grid-cols-2 gap-4' label={['Nama Mahasiswa', "NIM", "Nama PT Asal", "Fakultas", "Prodi", "Prodi Tujuan"]} data={[data.nama, data.nim, data.pt_asal, data.fakultas, data.prodi, data.prodi_tujuan]} width={"[80%]"} read={true} />
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
                <Form className='grid grid-cols-2 gap-4' label={['Mata Kuliah Asal', "Mata Kuliah Tujuan", "SKS Asal", 'SKS Tujuan', "Nilai Asal", "Nilai Tujuan"]} data={["", "", "", "", "", ""]} width={"[80%]"} onChange={handleChange} value={value} emptyValue={empty} />
            </div>
            <div className='flex justify-end items-center m-0'>
                <Button text={"Tambahkan ke Preview"} className={"my-5"} onClick={() => {
                    dispatch(addKonversi(value));
                    setEmpty({
                        addPreview: true,
                        empty: !empty.empty
                    });
                }}>
                    <Plus size={16} />
                </Button>
            </div>
        </>
    )
}

const PreviewAkademikSection = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.konversi.data);

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
                    data ? <PreviewNilaiSection data={data}/> : ""
                }
                <div className='flex justify-end gap-2'>
                    <Button text={"Simpan"} className={"mt-7"} />
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
        dispatch(deleteKonversi({index}))
    }

    console.log(data)

    return (
        <>
            {
                data.map((item, index) => (
                    <div className='mb-5 flex flex-col justify-center' style={{ borderBottom: "1px solid #CCCCCC" }} key={index}>
                        <Form className='grid grid-cols-2 gap-5' label={["Mata Kuliah Asal", "Mata Kuliah Tujuan", "SKS Asal", "SKS Tujuan", "Nilai Asal", "Nilai Tujuan"]} data={[item.mata_kuliah_asal, item.mata_kuliah_tujuan, item.sks_asal, item.sks_tujuan, item.nilai_asal, item.nilai_tujuan]} width={"[85%]"} onChange={handleChange} dataIndex={index} />
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