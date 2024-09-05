import { Search } from 'lucide-react'
import React from 'react'

function SearchingInput({ className, onChange }) {
    return (
        <div className="flex">
            <div className="flex">
                <div className="flex items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 dark:bg-[#2C2C2E] dark:text-slate-200 p-2 bg-[#F6F6F6]">
                    <Search size={16} />
                </div>
                <input type="text" className={`w-full max-w-[160px] pl-2 text-base outline-0 rounded-tr-lg rounded-br-lg dark:text-slate-200 dark:bg-[#2C2C2E] bg-[#F6F6F6] font-medium ${className}`} placeholder="Cari..." id="" onChange={onChange} />
            </div>
        </div>
    )
}

export default SearchingInput