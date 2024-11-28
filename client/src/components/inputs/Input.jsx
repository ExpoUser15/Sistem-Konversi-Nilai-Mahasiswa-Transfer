import React from 'react'

function Input({ label, value, read, width, onChange, emptyValue, inputName, type, className, extensi }) {

    return (
        <div className='flex flex-col mt-2'>
            {
                type === 'text' ?
                    <TextInput label={label} value={value} width={width} read={read} onChange={onChange} emptyValue={emptyValue} inputName={inputName}/>
                    :
                    <FileInput inputName={inputName} label={label} onChange={onChange} className={className} accept={extensi}/>
            }
        </div>
    )
}

const SelectInput = ({ inputName, width, label, value=[], selected, onChange, reference }) => {
    return (
        <>
            {
               label ?  (<label htmlFor={inputName} className='dark:text-slate-200'>{label}</label>) : ''
            }
            <select ref={reference} className={`${width} bg-gray-100 text-gray-900 border-0 rounded-md p-[7px] mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 dark:bg-[#2C2C2E] dark:text-slate-200`} onChange={onChange}>
                <option value="">{label ?  `Pilih ${label}` : ''}</option>
                {
                    value
                        .map((item, index) => (
                            <option 
                                value={typeof item === 'object' && !Array.isArray(item) ? item.id_mk : item } 
                                key={typeof item === 'object' && !Array.isArray(item) ? item.id_mk : item} >
                                    {typeof item === 'object' && !Array.isArray(item) ? item.mata_kuliah : item }
                            </option>
                        ))
                }
            </select>
        </>
    )
}

const TextInput = ({ label, value, read, width, onChange, inputName, reference }) => {
    return (
        <>
            <label htmlFor={inputName} className='dark:text-slate-200'>{label}</label>
            <input type="text" className={`${width} bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 dark:bg-[#2C2C2E] dark:text-slate-200`}
                placeholder={label}
                readOnly={read}
                defaultValue={value}
                onChange={onChange}
                ref={reference} 
                name={inputName}/>
        </>
    )
}

const FileInput = ({ label, inputName, onChange, className, accept }) => {
    return (
        <>
            <label htmlFor={inputName} className=' dark:text-slate-200'>{label}</label>
            <input type="file" className={`${className} bg-gray-100 text-gray-900 dark:bg-[#2C2C2E] dark:text-slate-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150`} placeholder="Resume" name={inputName} onChange={onChange} accept={accept}/>
        </>
    )
}

Input.TextInput = TextInput;
Input.SelectInput = SelectInput;
Input.FileInput = FileInput;

export default Input;