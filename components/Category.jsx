"use client"
import { useAppContext } from '@/context/AppContext'
import React from 'react'

 export const Category = () => {
  const {setSelectedCategoryNav,selectedCategoryNav,products ,searchQuery, setSearchQuery} =   useAppContext()
  const categories = ["เลือกกลุ่ม", ...new Set(products.map((product) => product.category))];
 
  return (
    <>
         <select
            value={selectedCategoryNav}
            onChange={(e) => setSelectedCategoryNav(e.target.value)}
            className="border border-gray-300 rounded-md p-1 my-2 "
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select> 
         <input
            type="text"
            placeholder="ค้นหาชื่อโลโก้..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-1 md:ml-4 w-full md:w-fit"
          />  
    </>
  )
}
