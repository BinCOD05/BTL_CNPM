import { Link } from "react-router";

function Home() {
  return (
    <>
      <div className="w-full h-[calc(100vh-76px)] flex justify-center items-center bg-slate-100">
        {/* Search */}
            <div className="flex flex-col justify-center items-center">
            <h1 className="text-[80px] font-bold text-blue-700">My Shop</h1>

            <form class="w-[660px] mt-8 mx-auto">
                <label
                for="default-search"
                class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                Search
                </label>
                <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    class="block w-full p-4 ps-10 text-sm text-gray-900 border border-black rounded-[1500px] bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Tìm kiếm sản phẩm"
                    required
                />
                
                </div>
            </form>
            </div>
        {/* Search */}
      </div>
    </>
  );
}
export default Home;
