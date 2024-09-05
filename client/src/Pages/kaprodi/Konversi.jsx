import React, { useState } from 'react'
import Tables from '../../components/tables/Tables';
import { Edit, Eye, ArrowDownToLine, Trash2 } from 'lucide-react';
// import ModalBerkas from '../../components/modalBox/ModalBerkas';
// import ModalDetail from '../../components/modalBox/ModalDetail';
import useDownload from '../../hooks/useDownload';
import ActionButton from '../../components/buttons/ActionButton';
import SearchingInput from '../../components/inputs/SearchingInput';
import ModalKonversi from '../../components/modalBox/ModalKonversi';
import { useDispatch } from 'react-redux';
import { clearData } from '../../redux/slices/konversiSlice';

function Konversi() {
    const dispatch = useDispatch();
    const [dataMahasiswa, setDataMahasiswa] = useState({});
    const [berkas, setBerkas] = useState("");
    const [jenisFile, setJenisFile] = useState("");
    const [nama, setNama] = useState("");
    const [pengajuan, setPengajuan] = useState([
        {
            id: "1",
            nama: "gideon",
            tanggal: '22 sep 2024',
            email: "Gideonaja@gmail.com",
            nim: "-",
            transkrip: '/kampus-merdeka-1@2x.png',
            surat_pindah: "/logo dan prodi.png",
            berkas: ["/logo dan prodi.png", "/kampus-merdeka-1@2x.png", "/r-1@2x.png"],
            status: "Pending",
            pt_asal: "Victory",
            fakultas: "Ilmu Komputer",
            prodi: "Sistem Informasi",
            prodi_tujuan: "Sistem Informasi"
        },
        {
            id:"2",
            nama: "Jenny",
            tanggal: '22 sep 2024',
            email: "Gideonaja@gmail.com",
            nim: "-",
            transkrip: '/logo dan prodi.png',
            surat_pindah: "/logo dan prodi.png",
            berkas: ["/logo dan prodi.png", "/kampus-merdeka-1@2x.png", "/r-1@2x.png"],
            status: "Converted",
            pt_asal: "Victory",
            fakultas: "Ilmu Komputer",
            prodi: "Informatika",
            prodi_tujuan: "Sistem Informasi",
            laporan: "/Gideon-Laporan_Konversi_Nilai-1723957489935.pdf"
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [isModalKonversiOpen, setIsModalKonversiOpen] = useState(false);

    const closeModal = (item) => {
        if (item === "detail") {
            return setIsModalDetailOpen(false);
        }

        if(item === "konversi"){
            dispatch(clearData());
            return setIsModalKonversiOpen(false);
        }

        setIsModalOpen(false);
    };

    const openModal = (item, item2, file) => {
        if (item === "detail") {
            setIsModalDetailOpen(true)
            setDataMahasiswa(item2);
            return;
        }

        if(item === "konversi"){
            setIsModalKonversiOpen(true);
            setDataMahasiswa(item2);
            return;
        }
        setIsModalOpen(true);
        setBerkas(item);
        setNama(item2);
        setJenisFile(file);
    };

    const downloadFile = useDownload();

    const handleDownload = (file) => {
        const fileUrl = 'http://localhost:5173/' + file;
        downloadFile(fileUrl);
    }

    return (
        <>
            <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Konversi</h3>
            </div>
            {/* Table */}
            <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                <div className="flex gap-2 items-center justify-between mb-5">
                    <h4 className="font-medium">Pengajuan Konversi</h4>
                    <SearchingInput />
                </div>
                <Tables fields={["Nama", "Tanggal", "Email", "Berkas", "Transkrip", "Surat Pindah", "Detail", "Status", ""]} gap={"5"}>
                    {pengajuan
                        .filter(item => item.status === "Pending")
                        .map((item, index) => (
                            <div
                                className={`grid grid-cols-9 mb-7 text-sm-3 gap-5 pb-2`}
                                style={{ borderBottom: "1px solid #CCCCCC" }}
                                key={index}
                            >
                                <div className='overflow-auto'>{item.nama}</div>
                                <div>{item.tanggal}</div>
                                <div className='overflow-x-auto'>{item.email}</div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => openModal(item.berkas, item.nama, ["KTP", "KK", "Ijazah"])}
                                >

                                    <ActionButton text={"Lihat Berkas"}>
                                        <Eye className='cursor-pointer' />
                                    </ActionButton>
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => openModal(item.surat_pindah, item.nama, "Transkrip Nilai")}
                                >
                                    <ActionButton text={"Lihat Transkrip"}>
                                        <Eye className='cursor-pointer' />
                                    </ActionButton>
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => openModal(item.transkrip, item.nama, "Surat Pindah")}
                                >
                                    <ActionButton text={"Lihat Surat Pindah"}>
                                        <Eye className='cursor-pointer' />
                                    </ActionButton>
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => openModal('detail', pengajuan[index])}
                                >
                                    <ActionButton text={"Lihat Detail"}>
                                        <Eye className='cursor-pointer' />
                                    </ActionButton>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <div className={`w-fit rounded-md ${item.status === 'Converted' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {item.status}
                                    </div>
                                </div>
                                <div
                                    onClick={() => openModal('konversi', pengajuan[index])}
                                >
                                    <ActionButton text={"Konversi"}>
                                        <Edit className='cursor-pointer' />
                                    </ActionButton>
                                </div>
                            </div>
                        ))}
                </Tables>
            </div>
            <div className='mb-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700'>
                <div className="flex gap-2 items-center justify-between mb-5">
                    <h4 className="font-medium">Riwayat Konversi</h4>
                    <SearchingInput />
                </div>
                <Tables fields={["No", "Nama", "Tanggal Konversi", "Laporan", "Status", ""]} gap={"1"}>
                    {pengajuan
                        .filter(item => item.status === "Converted")
                        .map((item, index) => (
                            <div
                                className={`grid grid-cols-6 mb-7 text-sm-3 gap-1 pb-2`}
                                style={{ borderBottom: "1px solid #CCCCCC" }}
                                key={index}
                            >
                                <div className='overflow-auto'>{index + 1}</div>
                                <div>{item.nama}</div>
                                <div>{item.tanggal}</div>
                                <div
                                    className="cursor-pointer w-10 rounded-md"
                                >
                                    <a target='_blank' href={item.laporan} className='text-black dark:text-slate-200 flex justify-center'>
                                        <ActionButton text={"Lihat Laporan"}>
                                            <Eye className='cursor-pointer' />
                                        </ActionButton>
                                    </a>
                                </div>
                                <div className='w-fit rounded-md text-green-600'>{item.status}</div>
                                <div className='flex gap-2 items-center justify-start'>
                                    <ActionButton text={"Edit"}>
                                        <Edit className='cursor-pointer' />
                                    </ActionButton>
                                    <ActionButton text={"Hapus"}>
                                        <Trash2 className='cursor-pointer' />
                                    </ActionButton>
                                    <ActionButton text={"Download"}>
                                        <ArrowDownToLine className='cursor-pointer' onClick={() => handleDownload(item.laporan)} />
                                    </ActionButton>
                                </div>
                            </div>
                        ))}
                </Tables>
            </div>

            {/* <ModalBerkas src={berkas} open={isModalOpen} onClose={closeModal} nama={nama} file={jenisFile} />
            <ModalDetail open={isModalDetailOpen} onClose={closeModal} data={dataMahasiswa} read={true}/>
            <ModalKonversi open={isModalKonversiOpen} onClose={closeModal} data={dataMahasiswa} read={false} img={"/Capture.PNG"}/> */}
        </>
    )
}

export default Konversi