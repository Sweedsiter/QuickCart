import React, { useState } from "react";
import emailjs from "emailjs-com";

const NewsLetter = () => {

  const [contactInfo, setContactInfo] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // EmailJS configuration
    const templateParams = {
      message: contactInfo, // Pass the contact info to the email template เดก้ด
    };

    emailjs
      .send(
        "service_644dvfd", // Replace with your EmailJS service ID
        "template_t3pkzmh", // Replace with your EmailJS template ID
        templateParams,
        "doJ5WM1xM3AmF3umY" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setIsSent(true); // Show success message
          setContactInfo(""); // Clear the input field       
        },
        (error) => {
          console.error("FAILED...", error);
        }
      );
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium py-6">สำหรับส่ง Email เพื่อติดต่อกลับ</h1>
      <p className="md:text-base text-gray-500/80 pb-8 ">
        กรุณากรอกข้อมูลอีเมลของคุณเพื่อให้เราสามารถติดต่อกลับได้ 

      </p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12"
      >
        <input
        name="message"
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="ส่งข้อมูลอีเมล"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)} // Update state on input change
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
      {isSent && (
        <p className="text-green-500 mt-4">ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว!</p>
      )}
    </div>
  );
};

export default NewsLetter;