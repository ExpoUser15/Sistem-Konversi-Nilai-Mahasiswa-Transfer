import React, { useEffect } from 'react'
import Tables from '../../components/tables/Tables';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../redux/thunks/apiThunks';
import Loading from '../../components/loader/Loading';

function LogAktivitas() {
    const dispatch = useDispatch();
    const log = useSelector(state => state.apiData.data);
    const loading = useSelector(state => state.apiData.loading);

    useEffect(() => {
        dispatch(fetchData({ endpoint: 'log' }));
        console.log(log);
    }, [dispatch])

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
                <Tables fields={["ID Aktivitas", "Nama", "Role", "Keterangan", "Tanggal"]} gap={'5'}>
                    {
                        !loading ? (
                            log.length > 0 ? (
                                log.map((item, index) => (
                                    <div
                                        className="grid grid-cols-5 mb-7 text-sm-3 gap-5 pb-2"
                                        style={{ borderBottom: "1px solid #CCCCCC" }}
                                        key={index}
                                    >
                                        <div className="overflow-x-auto">{item.id_aktivitas}</div>
                                        <div className="overflow-auto">{item.username}</div>
                                        <div className="overflow-auto">{item.user}</div>
                                        <div className="overflow-auto">{item.keterangan}</div>
                                        <div>{item.tanggal}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2">
                                    <p className="text-center col-span-10 italic">Data Kosong</p>
                                </div>
                            )
                        ) : (
                            <div className="grid grid-cols-10 mb-7 text-sm-3 gap-5 pb-2">
                                <div className="col-span-10 flex justify-center">
                                    <Loading />
                                </div>
                            </div>
                        )
                    }
                </Tables>
            </div>
        </>
    )
}

export default LogAktivitas