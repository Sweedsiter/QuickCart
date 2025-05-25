"use client";

import { CiCircleChevUp } from "react-icons/ci";
const ScrollTop = () => {
  function topFunction() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={topFunction}
      title="Go to top"
      className="text-white border p-1 bg-red-900 rounded-xl opacity-25 duration-300 hover:opacity-90"
    >
      <CiCircleChevUp style={{ fontSize: "2rem" }} />
    </button>
  );
};
export default ScrollTop;