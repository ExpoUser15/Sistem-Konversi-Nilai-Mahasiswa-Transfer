import React, { useEffect, useState } from 'react';
import Input from '../Inputs/Input';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { insertMK } from '../../redux/slices/konversiSlice';

function Form({ className, label, width, read, data, onChange, dataIndex, emptyValue }) {
    const [mk, setMk] = useState();
    const dispacth = useDispatch();

    const getMKData = async () => {
        try {
            axios.defaults.withCredentials = true;
            const url = `${import.meta.env.VITE_API_URL}matakuliah`;
            const response = await axios.get(url);
            setMk(response.data.data);
            dispacth(insertMK(response.data.data));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMKData();
    }, []);

    return (
        <form className={className}>
            {
                data.map((item, index) => {
                    const key = getKeyFromLabel(label[index]);
                    
                    return (
                        <>
                            {
                                key === 'mata_kuliah_tujuan' ? (
                                    <>
                                        <div className='flex flex-col mt-2'>
                                            <Input.SelectInput
                                                key={btoa(String(index))}
                                                width={'h-8'}
                                                value={mk}
                                                onChange={(e) => onChange(e, key, dataIndex)} 
                                                label={label.length !== 0 ? label[index] : ""}
                                                selected={dataIndex}
                                                data={data}
                                            />
                                        </div>
                                    </>
                                ):key === 'sks_tujuan' || key === 'sks_asal' ? (
                                    <>
                                        <div className='flex flex-col mt-2'>
                                            <Input.SelectInput
                                                key={btoa(String(label[index]))}
                                                width={'h-8'}
                                                value={['1', '2', '3', '4']}
                                                onChange={(e) => onChange(e, key, dataIndex)} 
                                                label={label.length !== 0 ? label[index] : ""}
                                                selected={dataIndex}
                                                data={data}
                                            />
                                        </div>
                                    </>
                                ):(
                                    <Input
                                        key={btoa(String(index))}
                                        label={label.length !== 0 ? label[index] : ""}
                                        width={width}
                                        read={read}
                                        value={item}
                                        onChange={(e) => onChange(e, key, dataIndex)} 
                                        emptyValue={emptyValue}
                                        type={"text"}/>
                                )
                            }
                        
                        </>
                    )
                })
            }
        </form>
    )
}

const getKeyFromLabel = (label) => {
    const keyMapping = {
        'Mata Kuliah Asal': 'mata_kuliah_asal',
        'Mata Kuliah Tujuan': 'mata_kuliah_tujuan',
        'SKS Asal': 'sks_asal',
        'SKS Tujuan': 'sks_tujuan',
        'Nilai Asal': 'nilai_asal',
        'Nilai Tujuan': 'nilai_tujuan'
    };
    return keyMapping[label] || label; 
};

export default Form