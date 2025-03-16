"use client";
import { useRouter} from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleTryNow = () => {
    router.push("/apps/creat");
  };

  return (
    <>
      <div className="w-[100%] overflow-hidden ">
        <div className="absolute top-[-97px] right-[700px] xl:right-[432px] lg:right-[500px] z-8 w-[1305px] h-[648px] flex-none pointer-events-none transform rotate-45">
          <div className="absolute w-full h-full rounded-none"></div>
        </div>
        <div
          className="absolute left-[-231px] top-[259px] h-[190px] w-[100%] z-10 overflow-hidden pointer-events-none"
          style={{
            transform: "rotate(22deg) translateZ(0)",
            background:
              "linear-gradient(90deg, rgb(229, 129, 194) 14%, rgba(255, 255, 255, 0) 100%)",
            mask: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0) 100%)",
            mixBlendMode: "overlay",
          }}
        ></div>

        <div
          className="absolute left-[-251px] top-[441px] h-[100px] w-[100%] z-10 overflow-hidden pointer-events-none opacity-80"
          style={{
            transform: "rotate(30deg) translateZ(0)",
            background:
              "linear-gradient(90deg, rgb(229, 129, 194) 14%, rgba(255, 255, 255, 0) 100%)",
            mask: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0) 100%)",
            mixBlendMode: "overlay",
          }}
        ></div>

        <div
          className="absolute left-[-351px] top-[534px] h-[228px] w-[100%] z-10 overflow-hidden pointer-events-none"
          style={{
            transform: "rotate(38deg) translateZ(0)",
            background:
              "linear-gradient(90deg, rgb(229, 129, 194) 14%, rgba(255, 255, 255, 0) 100%)",
            mask: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0) 100%)",
            mixBlendMode: "overlay",
          }}
        ></div>
        <div
          className="h-screen flex flex-col justify-center items-center"
          style={{
            marginTop: "-70px",
            background:
              "radial-gradient(102% 100% at 1% 60%, rgb(246,212,235) 0%, rgb(186,47,123) 54%, rgb(72,15,45) 80%, rgb(0,0,0) 100%)",
            padding: "20px",
          }}
        >
          <div className="reletive flex flex-col items-center justify-center h-screen text-white text-center p-5">
            {/* 标题 */}
            <h1 className="text-5xl md:text-9xl font-bold mb-12">
              AI Music Generator
            </h1>
            {/* 副标题 */}
            <h4 className="text-xl md:text-3xl text-white mb-10 w-[80%] md:w-[60%] mx-auto text-center">
              Create unique, never-before-heard music with just one click using
              advanced AI technology.
            </h4>

            {/* 按钮 */}
            <button 
              onClick={handleTryNow}
              className="bg-black text-white px-24 py-5 rounded-3xl text-lg transition-all duration-100 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/50 active:scale-95"
            >
              Try Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
