import React from 'react';

function ActionButton({ text, children, onClick }) {
    return (
        <div className="group relative">
            <button className='bg-transparent dark:text-slate-200' onClick={onClick}>
                {children}
            </button>
            <span
                className="absolute text-nowrap text-sm-3 font-semibold -top-10 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-[#F6F6F6] dark:bg-[#2C2C2E] dark:text-slate-200 py-2 shadow-md transition-all duration-300 ease-in-out group-hover:scale-90"
            >{text} <span> </span
            ></span>
        </div>
    )
}

export default ActionButton;