import React, { useState } from 'react'
import Tables from '../../components/tables/Tables'
import ActionButton from '../../components/buttons/ActionButton';
import { Edit, Plus, Trash2 } from 'lucide-react';
import SearchingInput from '../../components/inputs/SearchingInput';
import Button from '../../components/buttons/Button';

function Pengguna() {
    const [users, setUsers] = useState([
        {
            username: 'Gideon',
            id: "A001",
            pengguna: "Akademik"
        },
        {
            username: 'Damian',
            id: "K001",
            pengguna: "Kaprodi"
        }
    ]);

    return (
        <>
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Pengguna</h3>
            </div>
            {/* Table */}
            <div className="mt-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex gap-2 items-center justify-between mb-5">
                    <h4 className="font-medium">Daftar Pengguna</h4>
                    <SearchingInput />
                </div>
                <Tables fields={["No", "ID Pengguna", "Username", "Pengguna", ""]} gap={"1"}>
                    {users
                        .map((item, index) => (
                            <div
                                className={`grid grid-cols-5 mb-7 text-sm-3 gap-1 pb-2`}
                                style={{ borderBottom: "1px solid #CCCCCC" }}
                                key={index}
                            >
                                <div className='overflow-x-auto'>{index + 1}</div>
                                <div className='overflow-x-auto'>{item.id}</div>
                                <div className='overflow-auto'>{item.username}</div>
                                <div className='overflow-auto'>{item.pengguna}</div>
                                <div className='flex gap-2 items-center justify-center'>
                                    <ActionButton text={"Edit"}>
                                        <Edit className='cursor-pointer' />
                                    </ActionButton>
                                    <ActionButton text={"Hapus"}>
                                        <Trash2 className='cursor-pointer' />
                                    </ActionButton>
                                </div>
                            </div>
                        ))}
                </Tables>
            </div>
            <Button text={"Tambah"}>
                <Plus size={20} />
            </Button>
        </>
    )
}

export default Pengguna