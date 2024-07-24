
import { FC } from 'react'

type FooterProps = {}

const Footer: FC<FooterProps> = () => {
  return (
    <div className='bg-blue-800 py-10 sm:py-6'> 
    <div className='mx-auto container flex justify-between items-center'>
        <span className='text-3xl text-white font-bold tracking-tight'>StayHub.com</span>
        <span className='text-white font-bold tracking-tight flex gap-4'>
            <p className='cursor-pointer'>Privacy Policy</p>
            <p className='cursor-pointer'>Terms of Service</p>
        </span>
    </div>
     </div>
  )
}

export default Footer;