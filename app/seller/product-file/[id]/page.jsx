"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductUrl() {
    const { id } = useParams();
    const router = useRouter();
    const [updateFile, setUpdateFile] = useState({})
    const [statuFile, setStatueFile] = useState(false)

    // Fetch product data using the `id` parameter
    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`/api/product/product-file-check?id=${id}`);
            const data = await response.json();
            if (data.success) {
                setUpdateFile(data.product);
                setStatueFile(true)
            } else {
                toast.error(data.message);
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

    // Update File to Database
    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('product_id', id); // Append the product ID
    
        // Append updated files to the formData
        const wilcomFile = document.getElementById('wilcomUp').files[0];
        const pesFile = document.getElementById('pesUp').files[0];
        const dstFile = document.getElementById('dstUp').files[0];
    
        if (wilcomFile) formData.append('wilcom', wilcomFile);
        if (pesFile) formData.append('pes', pesFile);
        if (dstFile) formData.append('dst', dstFile);

     
        try {
            const response = await fetch('/api/product/product-file-update', {
                method: 'PUT',
                body: formData,
            });
    
            const data = await response.json();
    
            if (data.success) {
                toast.success('Files updated successfully!');
                router.push("/seller");
            } else {
                toast.error(data.message || 'Failed to update files');
            }
        } catch (error) {
            toast.error(error.message || 'An unexpected error occurred');
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
            {
                !statuFile ?
                // Get New file to database
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
                    </form> :

                    // Update file to Database
                    <form onSubmit={handleSubmitUpdate} >
                        <div className="flex flex-col gap-1 max-w-md py-2">
                            <label className="text-base font-medium" htmlFor="product-name">
                                Wilcom file
                            </label>
                            <input
                                name='.EMB'
                                id="wilcomUp"
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
                                id="pesUp"
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
                                id="dstUp"
                                type="file"
                                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded my-4"
                        >
                            Update-File
                        </button>
                    </form>
            }

        </div>
    )
}
