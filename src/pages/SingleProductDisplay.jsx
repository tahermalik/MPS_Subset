import { Header, Footer } from "./LandingPage";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useState } from "react";
import { setImageCounter } from "../redux/slices/activeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { SideBar,SubMenu } from "./LandingPage";
import { Breadcrumbs } from "./Breadcrumbs";
import { BASE_URL } from "./endpoints";
import { useGetProductData } from "../hooks/useGetProductData";
import { useEffect } from "react";

function OfferComponent(props) {
    const dispath = useDispatch();
    let counter = Number(useSelector((state) => state?.active?.imgCounter))
    function discountCalc(price, discount) {
        price = Number(price)
        discount = Number(discount)
        return price - Math.floor((price * discount) / 100);
    }

    function gramAmountCalc(price, discount, netQuantity) {
        price = Number(price)
        discount = Number(discount)
        netQuantity = Number(netQuantity)
        let discuntedPrice = discountCalc(price, discount);
        let totalGrams = netQuantity * 1000;
        return (100 * (discuntedPrice / totalGrams)).toFixed(2)
    }

    return (
        <>
            <div
                className={`flex flex-col flex-shrink-0 rounded-2xl p-3 cursor-pointer transition-all duration-300 backdrop-blur-xl
                ${counter === props.index
                            ? "border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-[0_15px_40px_rgba(37,99,235,0.45)] scale-[1.03]"
                            : "border border-blue-200/50 bg-white/60 shadow-[0_8px_25px_rgba(37,99,235,0.18)] hover:shadow-[0_12px_35px_rgba(37,99,235,0.28)] hover:-translate-y-1"
                }`}
                onClick={() => dispath(setImageCounter(props.index))}
            >
                {/* Quantity */}
                <div
                    className="font-sans sm:text-lg lg:text-xl font-semibold text-blue-900 border-b border-blue-200/60 pb-1 mb-2 flex flex-row justify-center items-center w-full"
                >
                    <span>{props.netWeight} Kg</span>
                </div>

                {/* Pricing */}
                <div className="flex flex-col gap-1">
                    <div className="font-sans flex flex-row items-center gap-2">
                        <span className="sm:text-md lg:text-lg font-semibold text-slate-900">
                            &#8377;{discountCalc(props.originalPrice, props.discount)}
                        </span>

                        <span className="sm:text-sm text-slate-500">
                            MRP
                        </span>

                        <span className="line-through sm:text-sm text-slate-400">
                            ₹{props.originalPrice}
                        </span>
                    </div>

                    <div className="font-sans sm:text-sm text-slate-700 flex flex-row items-center gap-2">
                        <span>
                            ( &#8377;{gramAmountCalc(props.originalPrice, props.discount, props.netWeight)}/100g )
                        </span>

                        <span
                            className="px-2 py-[2px] rounded-full
                   bg-emerald-400/90 text-white
                   text-xs font-semibold tracking-wide
                   shadow-[0_4px_10px_rgba(16,185,129,0.45)]"
                        >
                            {props.discount}% OFF
                        </span>
                    </div>
                </div>
            </div>

        </>
    )
}

function ProductInfo(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /// this is the array which we are going to recevice via backend
    // const netQuantityArray = ["2", "4", "7", "15", "20"]; /// receving in Kg
    // const originalPriceArray = ["200", "300", "400", "500", "600"];
    // const discountArray = ["10", "5", "15", "20", "10"]

    const netWeightArray = props.netWeightArray
    console.log("Net weight",props?.netWeightArray)
    const originalPriceArray = props.originalPriceArray;
    const discountValueArray = props.discountValueArray
    const productName=props?.productName

    const userId = useSelector((state) => state?.user?.userData?._id)
    const productVariation = useSelector((state) => state?.active?.imgCounter)

    // this is the way of showing products information to the end user
    const details=props?.overview


    return (
        <div className="flex flex-col gap-6 w-full items-center overflow-auto scrollbar-hide rounded-3xl p-2 " data-lenis-prevent >

            {/* Product Title / Description */}
            <div className="line-clamp-3 w-full sm:text-lg md:text-xl lg:text-2xl
                  font-medium text-slate-800
                  leading-relaxed tracking-wide">
                <span>
                    {productName + " "+ netWeightArray[productVariation] + "KG"}
                </span>
            </div>

            {/* Offers */}
            <div className="flex flex-row gap-4 w-full overflow-x-auto scrollbar-hide p-2 rounded-2xl">
                {netWeightArray?.map((offer, index) => (
                    <OfferComponent
                        index={index}
                        netWeight={netWeightArray[index]}
                        originalPrice={originalPriceArray[index]}
                        discount={discountValueArray[index]}
                    />
                ))}
            </div>

            {/* offer button and add to cart button */}
            <div className="w-[100%] flex sm:flex-col sm:gap-5 gap-3">
                <div
                    onClick={(e) => { e.stopPropagation(); navigate("/Product_Page/SingleProductDisplay/Offer") }}
                    className="flex flex-row items-center justify-center w-full rounded-2xl py-3 px-4 border border-blue-300/40 bg-white/50 backdrop-blur-lg sm:text-lg lg:text-xl font-medium text-blue-900 shadow-[0_8px_25px_rgba(37,99,235,0.15)]
                    cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_12px_35px_rgba(37,99,235,0.25)]"
                >
                    <span className="hover:underline">Offers</span>
                </div>
            </div>


            {/* Product Details */}
            <div
                className="border border-blue-300/40 rounded-3xl p-4
               flex flex-col gap-4 w-full
               bg-white/60 backdrop-blur-xl
               shadow-[0_15px_40px_rgba(37,99,235,0.18)]"
            >
                <div className="sm:text-lg lg:text-xl font-semibold text-blue-900 underline">
                    Product Details
                </div>

                <div className="product-details grid grid-cols-2 w-full gap-4">
                    {details.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-2xl p-4 bg-white/70 backdrop-blur-md border border-blue-200/40 shadow-[0_6px_20px_rgba(37,99,235,0.12)]transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(37,99,235,0.25)]"
                        >
                            <div className="font-semibold text-blue-900 text-lg tracking-wide">
                                {item.key}
                            </div>
                            <div className="text-sm mt-1 text-slate-700 leading-relaxed">
                                
                                {isNaN(item?.value) ? item.value:item.value*props?.netWeightArray[productVariation] +" "+(item.unit || "")}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    )
}

function ProductImg({ imagesArray = [], productHeight }) {
    const counter = useSelector((state) => state?.active?.imgCounter) ?? 0;
    const imageSrc = imagesArray[counter];

    if (!imageSrc) return null;

    return (
        <div
            className="w-[500px] h-[500px] flex items-center justify-center
                 rounded-2xl bg-white/40 backdrop-blur-xl
                 shadow-[0_15px_40px_rgba(37,99,235,0.25)]
                 transition-all duration-500"
        >
            <img
                src={`${imageSrc}`}
                alt="Product image"
                className="w-full h-full md:object-contain object-contain
                   rounded-xl
                   transition-transform duration-500 ease-out
                   hover:scale-105
                   animate-imageFade"
            />
        </div>
    );
}

function SecondaryDetails(props) {
    const [detailsCounter, setDetailsCounter] = useState(false);

    return (
        <>
            <div className="w-full h-auto
                      bg-gradient-to-br from-blue-50/60 to-white
                      border border-blue-200/40
                      shadow-[0_20px_50px_rgba(37,99,235,0.18)]
                      backdrop-blur-xl
                      pb-4">

                {/* Tabs */}
                <div className="w-full h-[56px]
                        flex flex-row items-center justify-center
                        p-2 gap-2">

                    <div
                        className={`w-1/2 h-full flex flex-row justify-center items-center
                        rounded-2xl
                        text-sm sm:text-base lg:text-lg
                        font-semibold tracking-wide
                        transition-all duration-300
                        cursor-pointer
                        ${!detailsCounter
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)]"
                                : "bg-blue-100/70 text-blue-900 hover:bg-blue-200"
                            }`}
                        onClick={() => setDetailsCounter(false)}
                    >
                        Product Description
                    </div>

                    <div
                        className={`w-1/2 h-full flex flex-row justify-center items-center
                        rounded-2xl
                        text-sm sm:text-base lg:text-lg
                        font-semibold tracking-wide
                        transition-all duration-300
                        cursor-pointer
                        ${detailsCounter
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)]"
                                : "bg-blue-100/70 text-blue-900 hover:bg-blue-200"
                            }`}
                        onClick={() => setDetailsCounter(true)}
                    >
                        Manufacturer Details
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pt-2">
                    
                    {detailsCounter && 
                        <div>
                            {props?.manufactureDetails}
                        </div>
                    }
                    {!detailsCounter && 
                        <div>
                            {props?.productDetails}
                        </div>
                    }
                </div>

            </div>
        </>
    );
}

export default function SingleProductDisplay() {
    const headerHeight = useSelector((state) => state?.layout?.headerHeight)
    const [productHeight, setProductHeight] = useState(0);
    const dispatch = useDispatch()
    const location = useLocation()

    /// this is the point from where i am fetching the product data via custom hook
    const productId = location?.state;
    
    const productData=useGetProductData(productId);

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useLayoutEffect(() => {
        const windowHeight = window.innerHeight
        setProductHeight(windowHeight - headerHeight)
    }, [headerHeight])

    const [open, setOpen] = useState(false);
    const [animal, setAnimal] = useState("");


    /// herebackend call will be done with the help of product id to get all the information about a product
    // all the infomation will be stored in the product slice and then from there this information will be used further
    // const imagesArray = ["pedigree.jpg", "photo_21.jpg", "smartheart.jpg", "whiskas_product.jpg", "whiskas.jpg"]

    if (!productData || Object.keys(productData).length===0) {
        return (
            <div>Loading...</div>
        )
    }

    console.log("Holaaa",productData)

    return (
        <>
            <Header open={open} setOpen={setOpen} approachedFrom={"SingleProductDisplay"}/>
            <SideBar open={open} setOpen={setOpen} setAnimal={setAnimal} />
            <SubMenu animal={animal} />
            <Breadcrumbs/>
            <div
                className="w-full flex sm:flex-row flex-col gap-0 bg-gradient-to-br from-blue-50/60 via-blue-100/50 to-blue-200/40 backdrop-blur-xl border border-blue-200/40
                shadow-[0_20px_60px_rgba(37,99,235,0.25)] animate-fadeInProductDisplay"
                style={isDesktop ? { height: `${productHeight}px` }:undefined}
            >
                {/* LEFT: Product Images */}
                <div
                    className="sm:w-[40%] w-[100%] h-full sm:overflow-auto sm:scrollbar-hide flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-blue-600/20
                    shadow-inner transition-all duration-500 ease-out hover:bg-blue-500/20"
                >
                    <ProductImg
                        productHeight={productHeight}
                        imagesArray={productData?.image}
                    />
                </div>

                {/* RIGHT: Product Info */}
                <div
                    className="sm:w-[60%] w-[100%] sm:h-auto sm:p-4 p-2 flex flex-row flex-wrap justify-evenly gap-x-4 gap-y-10 sm:overflow-auto sm:scrollbar-hide
                    bg-white/40 shadow-[inset_0_0_30px_rgba(37,99,235,0.08)]
                    transition-all duration-500 h-fit"
                >
                    <ProductInfo
                        netWeightArray={productData.netWeight}
                        originalPriceArray={productData.originalPrice}
                        discountValueArray={productData.discountValue}
                        productId={productData._id}
                        brand={productData.brand}
                        overview={productData.overview}
                        productName={productData?.productName}
                    />
                </div>
            </div>

            <SecondaryDetails manufactureDetails={productData?.manufactureDetails} productDetails={productData?.productDetails}/>
            <Footer />
        </>
    )
}