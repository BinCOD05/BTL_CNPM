function ShoppingCart(){
    return(
        <div className="pt-[120px] min-h-[calc(100vh-100px)] w-full flex justify-center">
            <div className="w-[1200px]">
                <h1 className="text-[30px] font-semibold mb-10">Giỏ Hàng Của Bạn</h1>
                <div className="w-full min-h-[300px] border border-gray-300 rounded-md flex flex-col items-center justify-center">
                    <h1 className="text-[20px] font-medium">Chưa có sản phẩm trong giỏ hàng</h1>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart