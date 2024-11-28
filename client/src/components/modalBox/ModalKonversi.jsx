import { CircleX, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Form from '../Forms/Form';
import ActionButton from '../Buttons/ActionButton';
import Button from '../Buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addKonversi, deleteKonversi, emptyData, emptyFilteredData, filteredKonversi } from '../../redux/slices/konversiSlice';
import { postKonversiData } from '../../redux/thunks/apiThunks';
import Input from '../Inputs/Input';
import { addData } from '../../redux/slices/apiSlice';

function ModalKonversi({ open, img, data, onClose }) {
    const dispatch = useDispatch();
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
                <button onClick={() => { onClose(); dispatch(emptyData()); }} className="absolute -top-1 -left-1 outline-none w-fit p-0 cursor-pointer bg-transparent">
                    <CircleX className="text-red-600" />
                </button>
            </div>
            <div className='flex flex-col sm:flex-row gap-10 p-0 h-full'>
                <div className='w-full sm:w-[50%] h-full overflow-auto' style={{ border: "1px solid #CCCCCC" }}>
                    <img src={img} alt="Transkrip Nilai" loading='lazy' className='w-full h-full' />
                </div>
                <div className='w-full sm:w-[45%] overflow-y-auto overflow-x-hidden h-full pe-2'>
                    <h4 className='font-medium text-lg dark:text-slate-200'>Form Konversi</h4>
                    <AkademikFormSection data={data} />
                    {
                        konversiData.length !== 0 ? <PreviewAkademikSection data={data} onClose={onClose} /> : ""
                    }
                </div>
            </div>
        </dialog>
    )
}

const AkademikFormSection = ({ data }) => {
    const dispatch = useDispatch();
    const mkData = useSelector(state => state.konversi.mkData);
    const filteredMK = useSelector(state => state.konversi.filteredMk);
    const [value, setValue] = useState({
        mata_kuliah_asal: "",
        mata_kuliah_tujuan: "",
        nilai_asal: "",
        nilai_tujuan: "",
        sks_asal: "",
        sks_tujuan: ""
    });

    useEffect(() => {
        if (filteredMK.length === 0) {
            dispatch(filteredKonversi(mkData));
        }
    }, [mkData]);

    const mkAsalRef = useRef();
    const mkTujuanRef = useRef();
    const sksTujuanRef = useRef();
    const sksAsalRef = useRef();
    const nilaiAsalRef = useRef();
    const nilaiTujuanRef = useRef();

    const handleChange = (e, key) => {
        if (key in value) {
            setValue({
                ...value,
                [key]: e.target.value,
                sks_tujuan: sksTujuanRef.current.value
            });
        } else {
            console.warn(`Key '${key}' tidak ditemukan di state 'value'.`);
        }
    }

    const handleSelectedSKS = (e) => {
        if (e.target.value == "") {
            sksTujuanRef.current.value = "";
            return;
        }
        const findIndex = mkData.findIndex(item => e.target.value === item.id_mk);
        sksTujuanRef.current.value = mkData[findIndex].sks;
        handleChange(e, 'mata_kuliah_tujuan');
    }

    const [empty, setEmpty] = useState({
        addPreview: true,
        empty: ''
    });

    const handlePreview = () => {
        if(mkAsalRef.current.value === '' || mkTujuanRef.current.value === '' || sksAsalRef.current.value === '' || sksTujuanRef.current.value === '' || nilaiAsalRef.current.value === '' || nilaiTujuanRef.current.value === ''){
            return;
        }


        const index = mkData.filter(item => item.id_mk === value.mata_kuliah_tujuan);
        const dataAsal = `(${value.mata_kuliah_asal}) | (${value.nilai_asal}) | (${value.sks_asal})`;
        const dataTujuan = `(${index[0].mata_kuliah}) | (${value.nilai_tujuan}) | (${value.sks_tujuan})`;
        const obj = {
            dataAsal,
            dataTujuan
        }

        mkAsalRef.current.value = '';
        mkTujuanRef.current.value = '';
        sksAsalRef.current.value = '';
        sksTujuanRef.current.value = '';
        nilaiAsalRef.current.value = '';
        nilaiTujuanRef.current.value = '';
        dispatch(addKonversi(obj));

        const regex = /\(([^)]+)\)/g;
        const matches = obj.dataTujuan.match(regex);
        const mk = matches ? matches.map(match => match.slice(1, -1)) : [];

        const filterBruh = filteredMK.filter(item => item.mata_kuliah !== mk[0]);
        dispatch(filteredKonversi(filterBruh));

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
                <div className='grid grid-cols-2 gap-5 ms-1'>
                    <div className='flex flex-col mt-1'>
                        <Input.TextInput
                            reference={mkAsalRef}
                            label={"Mata Kuliah Asal"}
                            type={"text"}
                            onChange={(e) => { handleChange(e, "mata_kuliah_asal") }} />
                    </div>
                    <div className='flex flex-col mt-1'>
                        <Input.SelectInput
                            reference={mkTujuanRef}
                            label={"Mata Kuliah Tujuan"}
                            value={filteredMK.length === 0 ? mkData : filteredMK}
                            onChange={(e) => { handleSelectedSKS(e) }} />
                    </div>
                    <div className='flex flex-col mt-1'>
                        <Input.TextInput
                            reference={sksAsalRef}
                            label={"SKS Asal"}
                            type={"text"}
                            onChange={(e) => { handleChange(e, 'sks_asal') }} />
                    </div>
                    <div className='flex flex-col mt-1'>
                        <Input.TextInput
                            reference={sksTujuanRef}
                            label={"SKS Tujuan"}
                            type={"text"}
                            read={true}
                            onChange={(e) => { setValue({ ...value, sks_tujuan: e.target.value }) }} />
                    </div>
                    <div className='flex flex-col mt-1'>
                        <Input.TextInput
                            reference={nilaiAsalRef}
                            label={"Nilai Asal"}
                            type={"text"}
                            onChange={(e) => { handleChange(e, "nilai_asal") }} />
                    </div>
                    <div className='flex flex-col mt-1'>
                        <Input.TextInput
                            reference={nilaiTujuanRef}
                            label={"Nilai Tujuan"}
                            type={"text"}
                            onChange={(e) => { handleChange(e, "nilai_tujuan") }} />
                    </div>
                </div>
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

const PreviewAkademikSection = ({ data, onClose, state }) => {
    const dispatch = useDispatch();
    const mahasiswa = useSelector((state) => state.apiData.data);
    const datakon = useSelector((state) => state.konversi.data);
    const mkData = useSelector(state => state.konversi.mkData);

    const parseData = (data) => {
        const regex = /\((.*?)\)/g;

        const dataAsalMatches = [...data.dataAsal.matchAll(regex)];
        const dataTujuanMatches = [...data.dataTujuan.matchAll(regex)];

        const mata_kuliah_asal = dataAsalMatches[0] ? dataAsalMatches[0][1] : '';
        const nilai_asal = dataAsalMatches[1] ? dataAsalMatches[1][1] : '';
        const sks_asal = dataAsalMatches[2] ? dataAsalMatches[2][1] : '';

        const mata_kuliah_tujuan = dataTujuanMatches[0] ? dataTujuanMatches[0][1] : '';
        const nilai_tujuan = dataTujuanMatches[1] ? dataTujuanMatches[1][1] : '';
        const sks_tujuan = dataTujuanMatches[2] ? dataTujuanMatches[2][1] : '';

        const index = mkData.find(item => item.mata_kuliah === mata_kuliah_tujuan);

        return {
            mata_kuliah_asal,
            nilai_asal,
            sks_asal,
            mata_kuliah_tujuan: index ? index.id_mk : null,
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
        const newData = mahasiswa.filter(item => item.id_mahasiswa !== data.id_mahasiswa);
        dispatch(addData(newData));
        dispatch(emptyFilteredData());
        dispatch(emptyData());
        onClose();
    }

    const cancelKonversi = () => {
        dispatch(emptyData());
        dispatch(emptyFilteredData());
        dispatch(filteredKonversi(mkData));
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
                    <Button text={"Bersihkan"} className={"mt-7 bg-red-500 border-red-600"} onClick={cancelKonversi} />
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

    const handleDelete = (index, item) => {
        dispatch(deleteKonversi({ index, item }));
    }

    return (
        <>
            {
                data.map((item, index) => (
                    <div className='mb-5 flex flex-col justify-center' style={{ borderBottom: "1px solid #CCCCCC" }} key={item.dataAsal}>
                        <Form className='grid grid-cols-2 gap-5 p-1' label={["", ""]} data={[item.dataAsal, item.dataTujuan]} width={"[85%]"} onChange={handleChange} dataIndex={index} />
                        <div className='flex gap-1 justify-end items-center mt-5 pe-5'>
                            <ActionButton text={"Hapus"} onClick={() => { handleDelete(index, item.dataTujuan) }} >
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