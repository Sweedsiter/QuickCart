import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-40 md:w-64" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            ซอยเพชรเกษม 106 แขวงหนองค้างพลู  เขตหนองแขม กรุงเทพมหานคร 10160<br />
            <br />
            Phet Kasem 106 Nong Khang Phlu, Nong Khaem, Bangkok Thailand 10160
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Links</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/all-products">All-products</a>
              </li>

            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch ติดต่อ</h2>
            <div className="text-sm space-y-2">
              <p>โทร :  091 045 5990</p>
              <p>เมล์ : D27saitunlu@gmail.com</p>
              <p>      <a
                href="https://web.facebook.com/Dxebm"
                target="_blank"
                rel="noopener noreferrer"
              >
               เฟสบุ๊ค : Dxebm
              </a></p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Dx-emb All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;