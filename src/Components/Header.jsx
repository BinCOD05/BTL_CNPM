import { Link } from "react-router"

function Header(){
    return(
        <>
            <header className="w-full h-[76px] bg-slate-200 flex  items-center justify-between">
               <div className="w-[1440px] mx-auto flex justify-between items-center">
                 <div className="group-left flex space-x-2 justify-center items-center gap-3">
                    <Link to="/">
                        <h1 className="text-[24px] font-bold text-blue-600">MyShop</h1>
                    </Link>
                    <Link to="Catogory">
                        <div className="group rounded-[700px] px-3 py-2 hover:bg-slate-300 hover:shadow-sm flex flex-col justify-center items-center  transition-all duration-500 ">
                            <h1 className="text-slate-500 group-hover:text-slate-700">Explore</h1>
                        </div>
                    </Link>
                </div>
           
                <div className="group-right flex space-x-2 justify-between items-center gap-3">
                    <Link to="/Shopping-Cart">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512" className="text-slate-700 hover:text-slate-900">
                            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                          </svg>
                        </div>
                    </Link>
                    <Link to="/User">
                        <div className="bg-white rounded-[700px] px-3 py-2 hover:shadow-md flex flex-col justify-center items-center  transition-all duration-500 ">
                            <h1 className="font-semibold">Sign in</h1>
                        </div>
                    </Link>
                </div>



               </div>
            </header>
        </>
    )
}

export default Header