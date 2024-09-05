import React, { useEffect, useRef } from 'react'

function Input({ label, value, read, width, onChange, emptyValue, inputName, type }) {

    return (
        <div className='flex flex-col mt-2'>
            {
                type === 'text' ?
                    <TextInput label={label} value={value} width={width} read={read} onChange={onChange} emptyValue={emptyValue} inputName={inputName}/>
                    :
                    <FileInput inputName={inputName} label={label} onChange={onChange}/>
            }
        </div>
    )
}

const TextInput = ({ label, value, read, width, onChange, emptyValue, inputName }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (emptyValue !== undefined) {
            inputRef.current.value = "";
        }
    }, [emptyValue]);

    return (
        <>
            <label htmlFor={inputName} className='dark:text-slate-200'>{label}</label>
            <input type="text" className={`${width} bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 dark:bg-[#2C2C2E] dark:text-slate-200`}
                placeholder={label}
                readOnly={read}
                defaultValue={value}
                onChange={onChange}
                ref={inputRef} 
                name={inputName}/>
        </>
    )
}

const FileInput = ({ label, inputName, onChange }) => {
    return (
        <>
            <label htmlFor={inputName} className=' dark:text-slate-200'>{label}</label>
            <input type="file" className="bg-gray-100 text-gray-900 dark:bg-[#2C2C2E] dark:text-slate-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Resume" name={inputName} onChange={onChange}/>
        </>
    )
}

Input.TextInput = TextInput;
Input.FileInput = FileInput;

export default Input;