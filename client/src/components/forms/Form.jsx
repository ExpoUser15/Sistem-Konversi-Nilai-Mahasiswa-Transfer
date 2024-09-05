import React from 'react'
import Input from '../inputs/Input'

function Form({ className, label, width, read, data, onChange, dataIndex, emptyValue }) {

    return (
        <form className={className}>
            {
                data.map((item, index) => {
                    const key = getKeyFromLabel(label[index]);
                    return (
                        <Input
                            key={index}
                            label={label.length !== 0 ? label[index] : ""}
                            width={width}
                            read={read}
                            value={item}
                            onChange={(e) => onChange(e, key, dataIndex)} 
                            emptyValue={emptyValue}/>
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