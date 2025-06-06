'use client'
import React, { useState,useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";


const AddProduct = () => {

  const { getToken,router,isSeller} = useAppContext()

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState(`ลายปักขนาด cm ไฟล์ที่ได้รับ .emb ผีเข็ม 00++ Wilcom / Dst / Pes`);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false); // Loading state  
  const [imgArray,setImgArray] = useState(1)
  

// Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    const formData = new FormData()

    formData.append('name',name)
    formData.append('description',description)
    formData.append('name',name)
    formData.append('category',category)
    formData.append('price',price)
    formData.append('offerPrice',offerPrice)

    for (let i = 0; i < files.length; i++) {
      formData.append('images',files[i])      
    }
    try {
     const token = await getToken()
     const { data } = await axios.post('/api/product/add',formData,{headers:{Authorization:`Bearer ${token}`}})      

      if(!data){
        toast.error(data?.message || 'Failed to create product');
        return;
      }
       
      if (data.success){
        const newId = data.newProduct._id             
        toast.success(data.message)
        setFiles([])
        setName('')
        setDescription('')
        setCategory('')
        setPrice('')
        setOfferPrice('')   
        router.push(`/seller/product-file/${newId}`)    
      }else{
        toast.error(data.message)
      }     
          
    } catch (error) {
      toast.error(error.message)
    }finally {
      setLoading(false); // Set loading to false after submission
    }    
  };

      useEffect(() => {
        if(!isSeller){
          router.push('/')
        }    
      }, [isSeller]);

  // if add product get urlLink download files

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">

        <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 ">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(imgArray)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);  
                  setName(updatedFiles[0].name)              
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
             <span onClick={()=> setImgArray(imgArray + 1)} className="text-3xl px-4 border bg-green-500/60 text-white">+</span>
             <span onClick={()=> setImgArray(imgArray - 1)} className="text-3xl px-4 border bg-red-500/60 text-white">-</span>            
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div> 
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <input
              id="product-price"
              type="text"
              placeholder="กรลุ่มสินค้า"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        {/* <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
          disabled={loading} 
        >
          {loading ? "Adding..." : "ADD"} 
        </button> */}

        {loading ?  <button
          type="submit"
          className="px-8 py-2.5 bg-orange-200 text-white font-medium rounded"
          disabled={loading} 
        >
        Adding...        </button> :   <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
          disabled={loading} 
        >
          Add
        </button>
        } 
           
      </form>       
    </div>
  );
};

export default AddProduct;