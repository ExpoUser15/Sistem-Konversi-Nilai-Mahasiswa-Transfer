import React, { useState } from 'react'
import Tables from '../../components/tables/Tables';

function LogAktivitas() {
    const [log, setLog] = useState([
        {
            id: "00006bd9-4b0c-4261-b6a6-76c8b285fad1",
            nama: "Gideon",
            pengguna: "Akademik",
            keterangan: "Menambahkan mahasiswa baru",
            tanggal: "22 Sep 2024"
        },
        {
            id: "00006bd9-4b0c-4261-b6a6-76c8b285fad1",
            nama: "Jeff",
            pengguna: "Kaprodi",
            keterangan: "awokawokawok baru",
            tanggal: "22 Sep 2024"
        },
        {
            id: "00006bd9-4b0c-4261-b6a6-76c8b285fad1",
            nama: "Donn",
            pengguna: "Akademik",
            keterangan: "Menambahkan mahasiswa baru",
            tanggal: "22 Sep 2024"
        }
    ]);
    return (
        <>
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Aktivitas</h3>
            </div>
            {/* Table */}
            <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex gap-2 items-center mb-5">
                    <h4 className="font-medium">Log Aktivitas</h4>
                </div>
                <Tables fields={["ID Aktivitas", "Nama", "Pengguna", "Keterangan", "Tanggal"]}>
                    {log
                        .map((item, index) => (
                            <div
                                className={`grid grid-cols-5 mb-7 text-sm-3 gap-5 pb-2`}
                                style={{ borderBottom: "1px solid #CCCCCC" }}
                                key={index}
                            >
                                <div className='overflow-x-auto'>{item.id}</div>
                                <div className='overflow-auto'>{item.nama}</div>
                                <div className='overflow-auto'>{item.pengguna}</div>
                                <div className='overflow-auto'>{item.keterangan}</div>
                                <div>{item.tanggal}</div>
                                
                            </div>
                        ))}
                </Tables>
            </div>
        </>
    )
}

export default LogAktivitas