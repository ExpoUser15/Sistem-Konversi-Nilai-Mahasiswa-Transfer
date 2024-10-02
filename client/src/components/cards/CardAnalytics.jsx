import React from 'react'

function Card({ text, persentase, data, drop = false }) {
  return (
    <div className='leading-5 py-5 px-8 bg-white dark:bg-black rounded-md shadow dark:shadow-neutral-700'>
        <h4 className='font-medium'>{text}</h4>
        <div>
            <p className='text-[35px] font-semibold'>{data}</p>
            <div className='flex items-center gap-4'>
                <div className={`p-[5px] px-[10px] rounded-md ${!drop ? 'text-[#4F8E3F] bg-[#D7F4D5]' : 'text-[#C53089] bg-[#FBCEDE]'} text-[12px]`}>
                    {persentase}
                </div>
                <div className='text-sm-3'>
                    {text}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card;