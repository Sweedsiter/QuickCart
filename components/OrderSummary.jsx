import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "@/assets/assets"
import Image from "next/image";


const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  // Update the state with the selected file
  const [selectedFile, setSelectedFile] = useState(null); // State to store the file
  const [previewUrl, setPreviewUrl] = useState(null); // State to store the preview URL
  const [paySlip, setPaySlip] = useState("")
  const [isUploading, setIsUploading] = useState(false); // State to track upload status

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return toast.error("File size must be less than 5MB");
    }
    if (file) {
      setSelectedFile(file); // Update the file state
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
    }
  };
  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    } else{
      alert("กรุณาเข้าสู่ระบบโดย email ก่อนทำการสั่งซื้อ");
      router.push("/all-products");
    }  
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up the URL
      }
    };
  }, [previewUrl,user]);


  // Function to check if user is logged in and redirect to login page if not
  const checkUser = () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบโดย email ก่อนทำการสั่งซื้อ");

    } else {
      router.push("/add-address");
    }
  };

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/user/get-address', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0])
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // payment create url slip
  const paySlip_send = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      return toast.error("Please upload a file");
    }

    setIsUploading(true); // Set loading state to true

    try {
      const token = await getToken();

      // Create FormData to send the file
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Send the file to the backend
      const { data } = await axios.post("/api/payment/upload-slip", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Payment slip uploaded successfully");
        setPaySlip(data.fileUrl);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error uploading payment slip:", error);
      toast.error("Failed to upload payment slip");
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };


  const createOrder = async () => {
    setIsUploading(true); // Set loading state to true
    try {
      let cartItemsArray = Object.keys(cartItems).map((key) => ({ product: key, quantity: cartItems[key] }))
      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0)

      if (cartItemsArray.length === 0) {
        return toast.error('Cart is empty')
      }
      const token = await getToken()

      const { data } = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        items: cartItemsArray,
        paySlip: paySlip,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success(data.message)
        setCartItems({})
        router.push('/order-placed')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUploading(false); // Reset loading state
    }
  }

  //
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        toast.success("Copy รหัสเรียบร้อย");
    }).catch(() => {
        toast.error("Failed to copy!");
    });
};


  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5" >
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        กรอกเพื่อทำการสั่งซื้อ
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            เลือกที่อยู่เพื่อทำการสั่งซื้อ
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={checkUser}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">จำนวนลาย {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>ยอดรวม</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>


      </div>

      {
        paySlip ? <button onClick={createOrder}

          className={`w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 ${isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={isUploading} // Disable the button while uploading
        >
          {isUploading ? "Uploading..." : "ส่งข้อมูลการซื้อ"}
        </button> :     
          !selectedAddress ? 
          <span className="text-green-600">กรุณากรอกที่อยู่ก่อนทำการสั่งซื้อ</span> 
          :       
          <div>
          <p className="py-2 text-red-600">คําเดือน <br/>ขอวนสิทธิ์ผู้ที่ส่งข้อมูลไม่ถูกต้องตามประกาศ และ ข้อมูล จะถูกเก็บไว้ใน Server </p>
            
          <p className="py-2">เมื่อกดที่ตัวเลข Copy ออโต้</p>
          <div className="flex flex-row my-1">
            <Image className="max-w-12 my-1" src={assets.SCB} alt="arrow_icon_white" />
            <div className="pl-6">
              <p>HTAY AUNG</p>
              <p
                className="cursor-pointer text-blue-600 underline w3-wide tracking-[2px]"
                onClick={() => copyToClipboard("365 264010 7")}
              >
                365 264010 7
              </p>
            </div>
          </div>
  
          <div className="flex flex-row my-1">
            <Image className="max-w-12 my-1" src={assets.KRU} alt="arrow_icon_white" />
            <div className="pl-6">
              <p>HTAY AUNG</p>
              <p
                className="cursor-pointer text-blue-600 underline tracking-[2px]"
                onClick={() => copyToClipboard("345 904 8624")}
              >
                345 904 8624
              </p>
            </div>
          </div>
  
  
            <label className="text-base font-medium uppercase text-gray-600 block mt-4">
              แนบสลิปการโอนตรงนี้
            </label>
            
            <form onSubmit={paySlip_send} className="flex flex-col items-start gap-3">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Uploaded Preview"
                  className="max-w-24 mt-2"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              )}
              <input
                onChange={(e) => handleFileChange(e)}
                type="file"
                id="file"
              />
              <button
                type="submit"
                className={`w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={isUploading} // Disable the button while uploading
              >
                {isUploading ? "Uploading..." : "ส่งข้อมูลโอนเงิน"}
              </button>
            </form>
          </div> 
      }
    </div>
  );
};

export default OrderSummary;