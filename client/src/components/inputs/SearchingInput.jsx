import { Search } from 'lucide-react'
import React from 'react'
import { postData } from '../../redux/thunks/apiThunks';
import { useDispatch } from 'react-redux';

function SearchField({ placeholder, searchType }){
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        const value = e.target.value;
        if(searchType === 'mahasiswa'){
            dispatch(postData({ endpoint: 'mahasiswa/search', data: { search: value } }));
        }
        if(searchType === 'matakuliah'){
            dispatch(postData({ endpoint: 'matakuliah/search', data: { search: value } }));
        }
        if(searchType === 'pengguna'){
            dispatch(postData({ endpoint: 'users/search', data: { search: value } }));
        }
    }

    return (
        <div className='flex'>
            <SearchingInput placeholder={placeholder} onkeyup={(e) => { handleSearch(e); }}/>
        </div>
    )
}

function SearchingInput({ className, onChange, placeholder, onkeyup }) {
    return (
        <div className="flex">
            <div className="flex">
                <div className="flex items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 dark:bg-[#2C2C2E] dark:text-slate-200 p-2 bg-[#F6F6F6]">
                    <Search size={16} />
                </div>
                <input type="text" className={`w-full max-w-[160px] pl-2 text-base outline-0 rounded-tr-lg rounded-br-lg dark:text-slate-200 dark:bg-[#2C2C2E] bg-[#F6F6F6] font-medium ${className}`} placeholder={placeholder} id="" onChange={onChange} onKeyUp={onkeyup}/>
            </div>
        </div>
    )
}

export default SearchField;