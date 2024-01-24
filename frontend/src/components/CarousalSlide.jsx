function CarousalSlide({image,title,desc,slideNumber,totalslides}){
    return(
        <div id={`slide${slideNumber}`} className="carousel-item relative w-full">
                        <div className="flex flex-col items-center justify-center gap-4 px-[15%] w-full">
                            <img src={image} className="w-60 rounded-md border-2 border-gray-200" />
                            <p className="text-xl text-gray-200 ">{desc}</p>
                            <h3 className="text-2xl font-semibold">{title}</h3>
                            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                <a href={`#slide${(slideNumber==1?totalslides:(slideNumber-1))}`} className="btn btn-circle">❮</a> 
                                <a href={`#slide${(slideNumber)%totalslides+1}`} className="btn btn-circle">❯</a>
                            </div>
                        </div>
                    </div> 


    )

}
export default CarousalSlide;