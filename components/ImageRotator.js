"use client";

import React, { useRef, useEffect } from "react";

const ImageRotator = () => {
  // const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // const handleScroll = () => {
    //   // 使用 requestAnimationFrame 优化性能
    //   requestAnimationFrame(() => {
    //     if (imageRef.current) {
    //       // 计算滚动百分比
    //       const scrollPercentage = window.scrollY / (window.innerHeight - 100); // 假设头部高度为 100px
    //       // 计算旋转角度：从 -30 度到 0 度
    //       const rotation = Math.min(scrollPercentage * 60 - 30, 0);
    //       imageRef.current.style.transform = `rotate(${rotation}deg)`;
    //     }
    //   });
    // };
    // // 添加滚动事件监听
    // window.addEventListener("scroll", handleScroll);
    // // 清理事件监听
    // return () => {
    //   window.removeEventListener("scroll", handleScroll);
    // };
  }, []);

  return (
    <>
      <div className="absolute top-[62vh] w-full h-[30vh] mt-3 bg-gradient-to-b from-transparent to-gray-900 "></div>
      <div className="bg-gray-900 min-h-screen relative">
        {/* 图片容器 */}
        <div className="absolute left-[10vw] top-[-10vh]">
          <img
            src="/img/makebestmusic.png"
            className="w-[80vw] object-cover rounded-xl"
            alt="Rotating Image"
            placeholder="blur"
            priority={true}
          />
        </div>
      </div>
    </>
  );
};

export default ImageRotator;
