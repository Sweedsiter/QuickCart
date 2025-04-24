import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const HeaderSlider = () => {
   const { router } =  useAppContext()
  const sliderData = [
    {
      id: 1,
      title: "Dx-emb รับตีลายปักโดยโปรแกรม Wilcom Version ล่าสุด และเครื่องปักคุณภาพสูง แปลงไฟล์ได้ทุกเวอร์ชั่น",
      offer: "",
      buttonText1: "สั่งตีลายใหม่",
      buttonText2: "ดูสินค้าทั้งหมด",
      imgSrc: assets.wilcom,
    },
    {
      id: 2,
      title: "ไฟล์ที่ลูกค้าจะได้รับ คือไฟล์รูปภาพและ .pes .dst และ .emb ที่สามารถนำไปใช้ได้กับเครื่องปักทุกยี่ห้อ",
      offer: "",
      buttonText1: "สั่งตีลายใหม่",
      buttonText2: "ดูสินค้าทั้งหมด",
      imgSrc: assets.กรณ์อาฌาณ,
    },
    {
      id: 3,
      title: "บริการหลังบ้าน 24 ชั่วโมง เพื่อให้ลูกค้าได้ไฟล์ที่ดีที่สุด และ คุณภาพที่ดี",
      offer: "",
      buttonText1: "สั่งตีลายใหม่",
      buttonText2: "ดูสินค้าทั้งหมด",
      imgSrc: assets.service,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-gray-100  py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:py-16 md:mt-0">
              <p className="md:text-base text-orange-600 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium">
                  {slide.buttonText1}
                </button>
                <button onClick={() => { router.push('/all-products') }} className="group flex items-center gap-2 px-6 py-2.5 font-medium" >
                  {slide.buttonText2}
                  <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center w-full " >
              <Image
                className="md:w-1/3 w-48 "
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-12">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-4 w-4 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-400" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
