import React from 'react'

function Card() {
  return (
    <div className='leading-5 py-5 px-8 bg-white dark:bg-black rounded-md shadow dark:shadow-neutral-700'>
        <h4 className='font-medium'>Total Konversi</h4>
        <div>
            <p className='text-[35px] font-semibold'>50</p>
            <div className='flex items-center gap-4'>
                <div className='bg-[#D7F4D5] p-[5px] px-[10px] rounded-md text-[#4F8E3F] text-[12px]'>
                    +2.5%
                </div>
                <div className='text-sm-3'>
                    6 Bulan Terakhir
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card;