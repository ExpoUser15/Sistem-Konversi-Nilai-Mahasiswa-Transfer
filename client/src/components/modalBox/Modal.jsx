import React, { useEffect, useRef, useState } from 'react';
import { CircleX, ChevronLeft, ChevronRight } from "lucide-react";
import "./backdrop.css";
import Button from '../buttons/Button';
import Input from '../inputs/Input';
import useCompressedImage from '../../hooks/useCompressedImage';

function Modal({ children, open, className }) {
    const modalRef = useRef();

    useEffect(() => {
        if (open) {
            modalRef.current.showModal();
        }
    }, [open]);

    if (!open) return null;

    return (
        <dialog className={`${className} rounded-lg shadow-md dark:bg-black`} ref={modalRef}>
            {children}
        </dialog>
    )
}

const ModalBerkas = (({ src, open, onClose, file, nama, setSpesifikBerkas, onClick }) => {
    const [berkas, setBerkas] = useState('');
    const [index, setIndex] = useState(0);

    const berkasRef = useRef();

    const handleNext = () => {
        if (index < src.length - 1) {
            setIndex(index + 1);
        } else {
            setIndex(0);
        }

        const newIndex = index < src.length - 1 ? index + 1 : 0;
        setBerkas(src[newIndex]);
    };

    const handlePrevious = () => {
        if (index > 0) {
            setIndex(index - 1);
        } else {
            setIndex(src.length - 1);
        }

        const newIndex = index > 0 ? index - 1 : src.length - 1;
        setBerkas(src[newIndex]);
    };

    const handleEditFile = async (e) => {
        if(typeof file === 'object'){
            return setSpesifikBerkas({ [file[index].toLowerCase()]: await useCompressedImage(e) });
        }
        const splitKey = file.toLowerCase().split(' ');
        const str = splitKey.join('_'); 
        const key = file === 'Transkrip Nilai' ? splitKey[0] : str;
        setSpesifikBerkas({ [key]: await useCompressedImage(e) });
    }

    useEffect(() => {
        if (open) {
            berkasRef.current.src = berkas;
            berkasRef.current.alt = file[index];
        }
    }, [berkas, index]);

    return (
        <>
            <div className='relative w-full'>
                <div className='hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-[#2C2C2E] duration-200 w-fit p-2 rounded-sm text-sm-3'>
                    {`${typeof file !== 'object' ? file : file[index]} (${nama})`}
                </div>
                <button onClick={() => { onClose(""); }} className="absolute -top-1 -right-1 outline-none w-fit p-0 cursor-pointer bg-transparent">
                    <CircleX className="text-red-600" />
                </button>
            </div>
            <img src={typeof src === 'object' ? src[index] : src} alt={file} className="w-full h-auto" loading='lazy' ref={berkasRef} />
            {
                typeof src === 'object' ? (
                    <>
                        <div className='p-1 pb-0 rounded-md hover:bg-slate-300 bg-transparent text-slate-400 hover:text-slate-700 duration-200 w-fit text-2xl absolute top-1/2 right-2 transform -translate-y-1/2' onClick={() => handleNext()}>
                            <ChevronRight size={32} />
                        </div>
                        <div className='p-1 pb-0 rounded-md hover:bg-slate-300 bg-transparent text-slate-400 hover:text-slate-700 duration-200 w-fit text-2xl absolute top-1/2 left-2 transform -translate-y-1/2' onClick={() => handlePrevious()}>
                            <ChevronLeft size={32} />
                        </div>
                    </>
                ) : (
                    <></>
                )
            }
            <div className='px-2 mt-5'>
                <Input type={"file"} label={'Edit File Ini'} onChange={handleEditFile} />
                <div className='flex justify-end'>
                    <Button text={'Edit'} onClick={onClick}></Button>
                </div>
            </div>
        </>
    );
});

function ModalCustom({ onClose, action, title, children, formClass, onClick }) {
    return (
        <>
            <div className="relative w-full">
                <button onClick={onClose} className="absolute -top-1 -right-1 outline-none w-fit p-0 cursor-pointer bg-transparent">
                    <CircleX className="text-red-600" />
                </button>
            </div>
            <div className="flex flex-col items-center justify-center px-10 pb-3">
                <div className="w-full max-w-md p-0">
                    <h3 className="text-2xl mb-4 dark:text-slate-200 pb-2" style={{ borderBottom: "1px solid #CCC" }}>{title}</h3>

                    <form className={`${formClass} text-sm-3`}>
                        {children}
                        {
                            action ? <Button text={"Simpan"} className={"mt-2 ms-auto w-full col-span-2 flex justify-center"} onClick={onClick}/> : ""
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

Modal.ModalCustom = ModalCustom;
Modal.ModalBerkas = ModalBerkas;

export default Modal