
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import Contact from "@/components/Contact";


const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Dx-emb - ลายปัก",
  description: `wilcom embroidery, ลายปัก , รับตีลายปัก, รับขึ้นลายปัก, ลายปักอาร์ม`,
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth ">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            {children}         
            <div className="fixed bottom-3 right-3  md:bottom-16 md:mr-20  z-50">
              <Contact />
            </div>
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
