import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen justify-center">
      <div className="m-auto rounded-lg outline outline-white max-w-lg p-5">
        <label>
          <span className="text-2xl font-medium text-gray-700 dark:text-gray-200"> YouTube Link: </span>
          <input
            type="link"
            id="link"
            className="mt-0.5 w-full p-2 mb-2 h-10 rounded border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>




  <a
    className="group relative inline-block w-full text-center overflow-hidden border border-cyan-600 px-4 py-2 focus:ring-3 focus:outline-hidden"
    href="#"
  >
    <span
      className="absolute inset-y-0 left-0 w-[2px] bg-cyan-600 transition-all group-hover:w-full"
    ></span>
  
    <span
      className="relative text-lg font-medium text-cyan-600 transition-colors group-hover:text-white"
    >
      Start translate job
    </span>
  </a>



      </div>
    </div>
  );
}
