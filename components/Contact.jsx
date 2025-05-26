"use client";
import { FaFacebookMessenger } from "react-icons/fa";


const Contact = () => {


    return (
        <>
            <div>
                <a
                    href="https://m.me/Dxebm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center bg-slate  p-2  bottom-3 right-3 opacity-70  hover:opacity-100   transition-transform transform hover:scale-110 hover:bg-slate-200 rounded-full shadow-xl "
                >
                    <FaFacebookMessenger className="w-8 h-8 text-blue-600" />
                    {/* <span className="text-blue-600 text-[12px]">  ส่งข้อตวาม</span> */}
                </a>
            </div>
        </>
    );
};

export default Contact;

