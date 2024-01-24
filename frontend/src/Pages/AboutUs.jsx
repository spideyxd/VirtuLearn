import HomeLayout from "../layouts/HomeLayout";
import AboutMainImage from "../assets/images/AboutMainImage.png"
import AbdulKalam from "../assets/images/AbdulKalam.png"
import Modi from "../assets/images/Modi.png"
import Pratham from "../assets/images/Pratham.jpg"
import MotherTeresa from "../assets/images/MotherTeresa.png"
import BillGates from "../assets/images/BillGates.png"
import CarousalSlide from "../components/CarousalSlide";
function AboutUs(){
    const celeb=[
        {
            title:"Pratham Shetty",
            desc: "Second year Engineering student in MIT manipal. I made this project while learning web development. I have now learnt a lot about it",
            image:Pratham,
            slideNumber:1


        },
        {
            title:"Narendra Modi",
            desc:"just learning how to make these slides",
            image:Modi,
            slideNumber:2
        },
        {
            title:"Bill Gates",
            desc:"just learning how to make these slides",
            image:BillGates,
            slideNumber:3
        },
        {
            title:"Mother Teresa",
            desc:"just learning how to make these slides",
            image:MotherTeresa,
            slideNumber:4
        },
        {
            title:"APJ Abdul Kalam",
            desc:"just learning how to make these slides",
            image:AbdulKalam,
            slideNumber:5
        },
       
    ]
    return(
        <HomeLayout>
            <div className="pl-20 pt-20 flex flex-col text-white ">
                <div className="flex items-center gap-5 mx-10">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-5xl text-yellow-500 font-semibold">
                            Affordable and quality education
                        </h1>
                        <p className="text-xl text-gray-200">
                            Our goal is to provide the affordable and quality education
                            to the world. We are providing the platform for the aspiring teachers and 
                            students to share their skills creativity and knowledge to each other
                        </p>
                    
                    </section>
                    <div className="w-1/2 px-8 my-5">
                        <img id="test1" style={{filter:"drop-shadow(0px 10px 10px rgb(0,0,0))"}}
                        className="drop-shadow-2xl" src={AboutMainImage} height={500} width={500}/>
                    </div>
                
                
                </div>
                
                <div className="carousel w-1/2 my-16 m-auto">
                {celeb && celeb.map(celebr=><CarousalSlide 
                    {...celebr} 
                    key={celebr.slideNumber}
                     totalslides={celeb.length}/>)}
                    
                </div>
            
            
            </div>
        
        
        
        </HomeLayout>
    
    );

};
export default AboutUs;