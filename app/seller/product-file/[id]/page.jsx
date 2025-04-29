"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";


export default function ProductUrl() {

    const { id } = useParams(); // Extract the `id` from the URL
    const router = useRouter();
    const [updateFile, setUpdateFile] = useState({})
    const [statuFile , setStatueFile ] = useState(false)


    // Fetch product data using the `id` parameter
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/product/product-file-check?id=${id}`);
                const data = await response.json(); // Parse the JSON response
            

                if (data.success) {
                    setUpdateFile(data.product); // Log the product data   
                    setStatueFile(true)                             
                } else {
                    toast.error(data.message);
                } 
            } catch (error) {
                toast.error(error.message || "Failed to fetch product data");
            }
        };
        if (id) {
            fetchProduct();
        }
    }, [id, setUpdateFile]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('product_id', id); // Append the product ID

        // Append files to the formData
        const wilcomFile = document.getElementById('wilcom').files[0];
        const pesFile = document.getElementById('pes').files[0];
        const dstFile = document.getElementById('dst').files[0];

        if (wilcomFile) formData.append('files', wilcomFile);
        if (pesFile) formData.append('files', pesFile);
        if (dstFile) formData.append('files', dstFile);

        try {
            const response = await fetch('/api/product/product-file', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert('Files uploaded successfully!');
                router.push("/seller")
            } else {
                alert(data.message || 'Failed to upload files');
            }
        } catch (error) {
            alert(error.message || 'An unexpected error occurred');
        }
    };


    return (
        <div className='md:p-10 p-4 space-y-5 flex flex-col'>
            <p className='text-xl'>กรุณากรอก ไฟล์งาน</p>     
            {
                !statuFile ? <label className="text-lg ">
                    Product File New : {id}
                </label> : <label className="text-lg ">
                    Product File Old : {updateFile.product_id}
                </label>
            }
     
                <form onSubmit={handleSubmit} >
                <div className="flex flex-col gap-1 max-w-md py-2">
                    <label className="text-base font-medium" htmlFor="product-name">
                        Wilcom file
                    </label>
                    <input
                        name='.EMB'
                        id="wilcom"
                        type="file"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1 max-w-md py-2">
                    <label className="text-base font-medium" htmlFor="product-name">
                        PES file
                    </label>
                    <input
                        name='.pes'
                        id="pes"
                        type="file"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1 max-w-md py-2">
                    <label className="text-base font-medium" htmlFor="product-name">
                        DST
                    </label>
                    <input
                        name='.dst'
                        id="dst"
                        type="file"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded my-4"
                >
                    Submit
                </button>
            </form>     
        </div>
    )
}
