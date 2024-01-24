import { Link } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import HomePageImage from "../assets/images/HomePageMainImage.png"

function HomePage(){
    {/*the div within homelayout here will be sent as children to the homelayout*/}
    return(
        
        <HomeLayout>
            <div className="pt-10 text-white flex items-center justify-center gap-10 px-10 h-[90vh] bg-black">
                <div className="w-1/2 space-y-6">
                    <h1 className="text-5xl font-semibold">Find Out best  
                    <span className="text-yellow-500 font-bold">  Online Courses</span>
                    </h1>
                    <p className="text-xl text-gray-200">We Have A Large Library Of Courses Taught By highly Skilled And Qualified Faculties At A Very Afoordable Rate </p>
                    <div className="space-x-6">
                    <Link to="/courses">
                        <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-3">
                        Explore Courses
                        </button>
                    </Link>
                    <Link to="/contact">
                        <button className=" border border-yellow-500  px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-3">
                        Contact us
                        </button>
                    </Link>
                    </div>
                </div>
            <div className="w-1/2 flex items-center justify-center">
                <img alt="homepage image" src={HomePageImage} />
            </div>

            </div>
        
        </HomeLayout>
    )

}
export default HomePage;