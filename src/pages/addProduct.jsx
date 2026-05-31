import React, { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Upload } from "lucide-react"; ``
import Select from "react-select";
import { cat, dog, hamster, birds, turtle, rabbit } from "./LandingPage";
import { items_flavor, items_brands, items_breed, items_diet } from "./Product";
import { PRODUCT_ENDPOINTS } from "./endpoints";
import toast from "react-hot-toast";

export default function AddProduct() {
  const [path, setPath] = useState(
    {
      pet: "",
      category: "",
      type: "",
      flavor: "",
      breed: "",
      diet: "",
      productName: "",
      originalPrice: "",
      netWeight: "",
      discountValue: "",
      discountType: "",
      stock: "",
      manufactureDate: "",
      expiryDate: "",
      description: "",
      usp: "",
      brand:""
    }
  )
  const optionPets = [
    { value: "cat", label: "cat" },
    { value: "dog", label: "dog" },
    { value: "birds", label: "birds" },
    { value: "hamster", label: "hamster" },
    { value: "rabbit", label: "rabbit" },
    { value: "turtle", label: "turtle" },
  ];

  const descRef = useRef(null)
  const uspRef = useRef(null)

  const [optionsFlavor, setOptionFlavor] = useState(items_flavor.map((item) => ({ value: item, label: item })))
  const [optionsBreed, setOptionBreed] = useState(items_breed.map((item) => ({ value: item, label: item })))
  const [optionsDiet, setOptionDiet] = useState(items_diet.map((item) => ({ value: item, label: item })))
  const [optionsBrand, setOptionBrand] = useState(items_brands.map((item) => ({ value: item, label: item })))
  const [options, setOptions] = useState(optionPets)
  const [optionsCategory, setOptionsCategory] = useState([])
  const [optionsType, setOptionsType] = useState([])
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);


  // if other options are selected
  const [otherType, setOtherType] = useState(false)
  const [otherCategory,setOtherCategory]=useState(false)
  const [otherFlavor,setOtherFlavor]=useState(false)
  const [otherBreed,setOtherBreed]=useState(false)
  const [otherBrand,setOtherBrand]=useState(false)
  

  const [productDetails, setProductDetails] = useState([{ key: "", value: "", unit: "" }])

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#eff6ff",
      borderColor: "#60a5fa",
      borderRadius: "0.5rem",
      boxShadow: "none",
      padding: "2px 4px",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#dbeafe" : "white",
      color: state.isSelected ? "white" : "#1e3a8a",
      cursor: "pointer",
    }),
  };

  function generateOptionsFromObject(obj) {
    return Object.keys(obj).map((key) => ({ value: key, label: key }));
  }

  function generateOptionsFromArray(objArray, category = "") {
    if (category === "") return objArray.map((key) => ({ value: key, label: key }));
    else return objArray[category].map((key) => ({ value: key, label: key }));
  }

  function handlePetSelect(pet) {
    pet = pet.toLowerCase();
    if (pet === "cat") setOptionsCategory(generateOptionsFromObject(cat))
    else if (pet === "dog") setOptionsCategory(generateOptionsFromObject(dog))
    else if (pet === "birds") setOptionsCategory(generateOptionsFromArray(birds))
    else if (pet === "rabbit") setOptionsCategory(generateOptionsFromArray(rabbit))
    else if (pet === "turtle") setOptionsCategory(generateOptionsFromArray(turtle))
    else setOptionsCategory(generateOptionsFromArray(hamster))
    setPath({ ...path, pet: pet, category: "", type: "" })
    setOtherType(false)
    setOptionsType([])
    setOtherCategory(false)
    setOtherBrand(false)
    setOtherBreed(false)
    setOtherFlavor(false)
  }

  function handleCategorySelect(category) {
    if(category==="Other"){
      setOtherCategory(true)
    }else{
      if (path["pet"] === "cat") setOptionsType(generateOptionsFromArray(cat, category))
      else if (path["pet"] === "dog") setOptionsType(generateOptionsFromArray(dog, category))
      setPath({ ...path, category: category, type: "", flavor: "", breed: "", diet: "" })
      setOtherType(false)
      setOtherBrand(false)
      setOtherBreed(false)
      setOtherFlavor(false)
    }
  }

  function handleTypeSelect(type) {
    if (type === "Other") {
      setOtherType(true)

    } else setPath({ ...path, type: type })

    setOtherBrand(false)
    setOtherBreed(false)
    setOtherFlavor(false)
  }
  function handleFlavorSelect(flavor) {
    if(flavor==="Other"){
      setOtherFlavor(true)
    }else setPath({ ...path, flavor: flavor }) 
    setOtherBrand(false)
    setOtherBreed(false)
  }
  function handleBreedSelect(breed) { 
    if(breed==="Other"){setOtherBreed(true)}
    else setPath({ ...path, breed: breed }) 
    setOtherBrand(false)
  }
  function handleDietSelect(diet) { setPath({ ...path, diet: diet }) }
  
  function handleBrandSelect(brand) { 
    if(brand==="Other"){setOtherBrand(true)}
    else setPath({ ...path, brand: brand }) }
  function handleDiscountType(discountType) { setPath({ ...path, discountType: discountType }) }

  function handleReset() {
    setPath({
      pet: "", category: "", type: "", flavor: "", breed: "", diet: "",
      productName: "", originalPrice: "", netWeight: "", discountValue: "",
      discountType: "", stock: "", manufactureDate: "", expiryDate: "",
      description: "", usp: ""
    });
    setOptionsCategory([]);
    setOptionsType([]);
    setProductDetails([{ key: "", value: "", unit: "" }])
    setImage(null)
    setPreview(null)
    setOtherType(false)
    setOtherCategory(false)
    setOtherFlavor(false)
    setOtherBreed(false)
    setOtherBrand(false)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(path).forEach((key) => { formData.append(key, path[key]); });

      if (image) {
        formData.append("image", image);
      } else {
        toast.error("Upload the product image")
        return
      }

      if (productDetails.length < 3) {
        toast.error("Product's Overview should contains atleast 3 cards")
        return
      }

      formData.append("overview", JSON.stringify(productDetails))

      const res = await axios.post(`${PRODUCT_ENDPOINTS}/addProduct`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } })
      toast.success(res?.data?.message)

    } catch (error) {
      console.log("error occured in add Product in frontend", error)
    }
  }

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  function handleInput(e) {
    try {
      e.stopPropagation();
      const el = descRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
      const usp = uspRef.current;
      usp.style.height = "auto";
      usp.style.height = `${usp.scrollHeight}px`;
    } catch (error) {
      console.log("Problem while handling input in desc", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-2xl w-[95%] sm:w-[80%] p-4 sm:p-8"
      >
        <h2 className="text-xl sm:text-3xl font-bold text-blue-700 text-center mb-6">
          Add New Product
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Select options={options} onChange={(e) => handlePetSelect(e.label)} placeholder="Select Pet" styles={customStyles} value={options.find(o => o.value === path.pet) || null} required />
          {!otherCategory &&
            <Select options={optionsCategory} onChange={(e) => handleCategorySelect(e.label)} placeholder="Select Product Category" styles={customStyles} value={optionsCategory?.find(o => o.value === path.category) || null} required />
          }
          {otherCategory &&
            <input
                type="text"
                placeholder="Enter custom category"
                value={path.category}
                onChange={(e) => setPath({ ...path, category: e.target.value })}
                className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-full focus:outline-none"
              />
          }

          {(path["pet"] === "cat" || path["pet"] === "dog") && (!otherType) &&
            <Select options={optionsType} onChange={(e) => handleTypeSelect(e.label)} placeholder="Select Product Type" styles={customStyles} value={optionsType?.find(o => o.value === path.type) || null} required />
          }

          {(path["pet"] === "cat" || path["pet"] === "dog") && (otherType) &&
            <input
              type="text"
              placeholder="Enter custom type"
              value={path.type}
              onChange={(e) => setPath({ ...path, type: e.target.value })}
              className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-full focus:outline-none"
            />
          }

          {(path["pet"] === "cat" || path["pet"] === "dog") && (path["category"] === "treats" || path["category"] === "dog food" || path["category"] === "cat food") && (!otherFlavor) &&
            <div data-lenis-prevent>
              <Select options={optionsFlavor} onChange={(e) => handleFlavorSelect(e.label)} placeholder="Select Product Flavor" styles={customStyles} value={optionsFlavor?.find(o => o.value === path.flavor) || null} required />
            </div>
          }
          {(path["pet"] === "cat" || path["pet"] === "dog") && (path["category"] === "treats" ||    path["category"] === "dog food" || path["category"] === "cat food") && (otherFlavor) &&
            <input
              type="text"
              placeholder="Enter custom Flavor"
              value={path.flavor}
              onChange={(e) => setPath({ ...path, flavor: e.target.value })}
              className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-full focus:outline-none"
            />
          }

          {(path["pet"] === "dog") && (!otherBreed) &&
            <Select options={optionsBreed} onChange={(e) => handleBreedSelect(e.label)} placeholder="Select Breed" styles={customStyles} value={optionsBreed?.find(o => o.value === path.breed) || null} required />
          }
          {(path["pet"] === "dog") && (otherBreed) &&
            <input
              type="text"
              placeholder="Enter custom Breed"
              value={path.breed}
              onChange={(e) => setPath({ ...path, breed: e.target.value })}
              className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-full focus:outline-none"
            />

          }

          {(path["pet"] === "cat" || path["pet"] === "dog") && path["category"] !== "cage" && path["category"] !== "toys" &&
            <Select options={optionsDiet} onChange={(e) => handleDietSelect(e.label)} placeholder="Select Veg/Non-Veg" styles={customStyles} value={optionsDiet?.find(o => o.value === path.diet) || null} required />
          }

          {!otherBrand &&
            <div data-lenis-prevent>
              <Select options={optionsBrand} onChange={(e) => handleBrandSelect(e.label)} placeholder="Select Brand" styles={customStyles} value={optionsBrand?.find(o => o.value === path.brand) || null} required />
            </div>
          }
          {otherBrand &&
            <input
              type="text"
              placeholder="Enter custom Brand"
              value={path.brand}
              onChange={(e) => setPath({ ...path, brand: e.target.value })}
              className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-full focus:outline-none"
            />
          }

          <div className="border border-blue-500 rounded-xl p-2">
            <div className="text-blue-700 mb-2 underline">Product Details</div>
            <div className="productInfo w-full h-auto grid grid-cols-1 sm:grid-cols-3 items-center gap-x-4 gap-y-4">
              <div className="flex justify-center"><input required type="text" placeholder="Name of the product" value={path.productName} onChange={(e) => setPath({ ...path, productName: e.target.value })} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" /></div>
              <div className="flex justify-center"><input required type="Number" placeholder="MRP" value={path.originalPrice} onChange={(e) => setPath({ ...path, originalPrice: e.target.value })} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" /></div>
              <div className="flex justify-center"><input required type="Number" placeholder="Net Weight in KG" value={path.netWeight} onChange={(e) => setPath({ ...path, netWeight: e.target.value })} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" /></div>
              <div className="flex justify-center"><input required type="Number" placeholder="Discount Value" value={path.discountValue} onChange={(e) => setPath({ ...path, discountValue: e.target.value })} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" /></div>
              <Select
                options={[{ label: "percent", value: "percent" }, { label: "flat", value: "flat" }]}
                onChange={(e) => handleDiscountType(e.label)}
                placeholder="Select Discount Type"
                styles={customStyles}
                value={[{ label: "percent", value: "percent" }, { label: "flat", value: "flat" }]?.find(o => o.value === path.discountType) || null}
                required
              />
              <div className="flex justify-center"><input required type="Number" placeholder="Enter the Quantity" value={path.stock} onChange={(e) => setPath({ ...path, stock: e.target.value })} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" /></div>
              <div className="flex flex-col justify-center">
                <label htmlFor="manufactureDate" className="text-blue-500 text-sm">Manufacture Date</label>
                <input required type="date" id="manufactureDate" value={path.manufactureDate} onChange={(e) => setPath({ ...path, manufactureDate: e.target.value })} className="peer border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" />
              </div>
              <div className="flex flex-col justify-center">
                <label htmlFor="expiryDate" className="text-blue-500 text-sm">Expiry Date</label>
                <input required type="date" id="expiryDate" value={path.expiryDate} onChange={(e) => setPath({ ...path, expiryDate: e.target.value })} className="peer border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="border border-blue-500 rounded-xl p-2">
            <div className="text-blue-700 mb-2 underline">Product's Overview</div>
            <div className="flex flex-col gap-4">
              {productDetails.map((obj, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 w-full items-center">
                  <div className="flex justify-center">
                    <input required type="text" placeholder="Enter the label" value={obj["key"]} onChange={(e) => setProductDetails(prev => prev.map((obj, i) => i == idx ? { ...obj, key: e.target.value } : obj))} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" />
                  </div>
                  <div className="flex justify-center">
                    <input required type="text" placeholder="Enter the value" value={obj["value"]} onChange={(e) => setProductDetails(prev => prev.map((obj, i) => i == idx ? { ...obj, value: e.target.value } : obj))} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" />
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <input required type="text" placeholder="Enter the unit" value={obj["unit"]} onChange={(e) => setProductDetails(prev => prev.map((obj, i) => i == idx ? { ...obj, unit: e.target.value } : obj))} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none" />
                    {productDetails.length > 1 && (
                      <span onClick={(e) => { e.stopPropagation(); setProductDetails(prev => prev.filter((o, i) => i !== idx)) }} className="text-red-400 text-sm cursor-pointer hover:text-red-600 whitespace-nowrap">✕</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div onClick={(e) => { e.stopPropagation(); setProductDetails(prev => [...prev, { key: "", value: "", unit: "" }]) }} className="mt-3 text-blue-600 text-sm cursor-pointer hover:underline flex justify-center items-center gap-1">
              + Add More Detail
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <label htmlFor="productDesc" className="text-blue-500 text-sm">Product Description</label>
            <div className="flex justify-center"><textarea ref={descRef} id="productDesc" placeholder="Description of the Product" onInput={handleInput} value={path.description} onChange={(e) => setPath({ ...path, description: e.target.value })} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none max-h-[200px] no_scroll_bar overflow-y-auto" data-lenis-prevent /></div>
          </div>

          <div className="flex flex-col justify-center">
            <label htmlFor="productUSP" className="text-blue-500 text-sm">Product USP</label>
            <div className="flex justify-center"><textarea ref={uspRef} id="productUSP" placeholder="USP of the Product" onInput={handleInput} value={path.usp} onChange={(e) => setPath({ ...path, usp: e.target.value })} className="border border-[#60a5fa] rounded-2xl bg-[#eff6ff] py-2 px-4 w-[100%] focus:outline-none max-h-[100px] no_scroll_bar overflow-y-auto" data-lenis-prevent /></div>
          </div>

          <div className="h-auto w-full flex flex-col mt-5">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Upload an Image</h3>
            <label htmlFor="fileInput" className="flex flex-col items-center justify-center w-full h-[40px] border-2 border-dashed border-gray-400 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
              Upload the Image
            </label>
            <input type="file" id="fileInput" accept="image/*" onChange={handleChange} className="hidden" required />
            {image &&
              <div className="flex flex-col sm:flex-row w-full mt-2 gap-5">
                <div className="h-[200px] w-[200px] sm:h-[300px] sm:w-[300px]"><img className="h-[100%] w-[100%] object-contain" src={`${preview}`} alt="preview_img" /></div>
                <div>{image.name}</div>
              </div>
            }
          </div>

          <div className="flex w-full justify-center sm:justify-end gap-2">
            <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200">Submit</button>
            <button type="button" onClick={() => handleReset()} className="border border-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">Reset</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}