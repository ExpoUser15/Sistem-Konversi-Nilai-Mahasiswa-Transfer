import React from 'react'

function Button({ text, className, children, onClick }) {
    return (
        <>
            <button className={`cursor-pointer transition-all bg-blue-500 text-white px-4 py-2 rounded-lg
                border-blue-600
                border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex items-center gap-2 ${className}`} onClick={onClick}>
                <span>{text}</span> 
                { children }
            </button>
        </>
    )
}

export default Button;