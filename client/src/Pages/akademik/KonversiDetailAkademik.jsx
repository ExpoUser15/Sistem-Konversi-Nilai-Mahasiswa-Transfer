import React from 'react'
import Button from '../../components/buttons/Button';
import Tables from '../../components/tables/Tables';
import Loading from '../../components/loader/Loading';

function KonversiDetailAkademik() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // Ambil ID yang di-encode di URL
    const { id_mahasiswa, nama } = JSON.parse(atob(id));

    const loading = useSelector(state => state.konversi.loading);
    const data = useSelector(state => state.konversi.konversiData);
    const mkData = useSelector(state => state.apiData.data);

    useEffect(() => {
        dispatch(fetchKonversiData({ endpoint: `konversi/detail/${id_mahasiswa}` }));
        dispatch(fetchData({ endpoint: `matakuliah` }));
        dispatch(fetchData({ endpoint: `konversi/penempatan/${id_mahasiswa}` }));
    }, [dispatch]);

    useEffect(() => {
        axios.get(`http://localhost:3000/konversi/semester/${id_mahasiswa}`)
            .then(res => {
                console.log(res);
                setDataSemester(res.data.data);
            })
    }, []);

  return (
    <>
        <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
                <h3 className="font-medium">Detail Konversi {nama}</h3>
            </div>
            <main className="my-16">
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Detail Konversi</h4>
                    </div>
                    <Tables fields={["Mata Kuliah Asal", "SKS Asal", "Nilai Asal", "Mata Kuliah Tujuan", "SKS Tujuan", "Nilai Tujuan"]} gap={"5"}>
                        {
                            !loading ?
                                data
                                    .map((item, index) => (
                                        <div
                                            className={`grid grid-cols-6 mb-7 text-sm-3 gap-5 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={item.id_mk}
                                        >
                                            <div className='overflow-auto'>{item.mk_asal}</div>
                                            <div className='ps-3'>{item.sks_asal}</div>
                                            <div className='ps-3'>{item.nilai_asal}</div>
                                            <div>{item.mata_kuliah}</div>
                                            <div className='ps-3'>{item.sks}</div>
                                            <div className='ps-3'>{item.nilai_tujuan}</div>
                                            {/* <div className='flex gap-2 items-center justify-start '>
                                                <ActionButton text={"Edit"}>
                                                    <Edit className='cursor-pointer' onClick={() => openModal('edit', item)} />
                                                </ActionButton>
                                                <ActionButton text={"Hapus"} onClick={() => openModal('hapus', item)}>
                                                    <Trash2 className='cursor-pointer' />
                                                </ActionButton>
                                            </div> */}
                                        </div>
                                    )) :
                                (
                                    <div className={`grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2`} >
                                        <div className='col-span-10 flex justify-center'>
                                            <Loading />
                                        </div>
                                    </div>
                                )
                        }
                    </Tables>
                </div>
                <div className="my-16 bg-white px-8 py-3 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
                    <div className="flex gap-2 items-center justify-between mb-5">
                        <h4 className="font-medium">Penempatan</h4>
                    </div>
                    <div className='text-sm-3 grid grid-cols-4 gap-2'>
                        <div className='grid grid-cols-1'>
                            <Input.SelectInput width={'100%'} value={mkData} data={["", ""]} label={'Mata Kuliah'} onChange={(e) => {
                                setSemestervalue({ ...semesterValue, mata_kuliah: e.target.value });
                            }}></Input.SelectInput>
                        </div>
                        <div className='grid grid-cols-1'>
                            <Input.SelectInput width={'100%'} data={["", ""]} value={[1, 2, 3, 4, 5, 6, 7, 8]} label={'Semester'} onChange={(e) => {
                                setSemestervalue({ ...semesterValue, semester: e.target.value });
                            }}></Input.SelectInput>
                        </div>
                    </div>
                    <Button className={'margin-auto'} onClick={() => { handleSave() }}>Simpan</Button>
                    <div className='grid grid-cols-1 gap-5 mt-7'>
                        <Tables fields={["No", "Mata kuliah", "SKS", "Semester"]} gap={"2"}>
                            {
                                dataSemester.length !== 0 ? (
                                    dataSemester.map((item, index) => (
                                        <div
                                            className={`grid grid-cols-4 mb-7 text-sm-3 gap-2 pb-2`}
                                            style={{ borderBottom: "1px solid #CCCCCC" }}
                                            key={item.id_semester}
                                        >
                                            <div className='overflow-auto'>{index + 1}</div>
                                            <div>{item.mata_kuliah}</div>
                                            <div>{item.sks}</div>
                                            <div>{item.semester}</div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )
                            }
                        </Tables>
                    </div>
                    <div className='flex gap-2'>
                        <Button onClick={handleGeneratePDF}>
                            Generate PDF
                        </Button>
                        <Button onClick={goBack} className={'bg-red-500 border-red-500'}>
                            Kembali
                        </Button>
                    </div>
                </div>
            </main>
    </>
  )
}

export default KonversiDetailAkademik