import {BsFacebook,BsInstagram,BsLinkedin,BsTwitter} from 'react-icons/bs'
function Footer(){
    //relative left-0 bottom-0 means it will go at page bottom
    //10vh veiw port height is taken as reference and 10% 
    const currentDate=new Date();
    const year=currentDate.getFullYear();
    return(
        <>
        <footer className='relative left-0 bottom-0 py-3 px-5 h-[10vh] flex flex-col sm:flex-row items-center justify-between  text-white bg-gray-500 '>
            <section className='text-lg '>
                Copyright {year} | All rights reserved
            
            </section>
            <section className='flex items-center justify-center gap-5 text-2xl text-white'>
                <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'><BsFacebook/></a>
                <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'><BsInstagram/></a>
                <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'><BsTwitter/></a>
                <a className='hover:text-yellow-500 transition-all ease-in-out duration-300'><BsLinkedin/></a>
            </section>
        </footer>
        
        
        </>
    )

}
export default Footer;