import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-gray-100 my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-56"
        src={assets.Logo3}
        alt="jbl_soundbox_image"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          ขึ้นลายปักโลโก้ ส่งงานวันต่อวัน
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          โลโก้ โรงเรียน สถาบัน องค์กร บริษัท หน่วยงานราชการ ราคาเริ่มต้นที่ 150 บาท
        </p>
        <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white">
          ติดต่อเรา&nbsp;&nbsp;&nbsp;
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block max-w-80 p-1"
        src={assets.Logo2}
        alt="md_controller_image"
      />
   
    </div>
  );
};

export default Banner;