"use client";
import { useRef, useEffect, useState } from "react";
import { FiPlay, FiPause } from "react-icons/fi";

const MusicPlayer = ({
  musicUrl,
  imgUrl,
  musicName,
  onClose,
  isPlaying: propIsPlaying, // 从父组件传递的播放状态
  onPlayPause, // 播放/暂停回调
}) => {
  const audioRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(true);
  const [isPlaying, setIsPlaying] = useState(propIsPlaying); // 本地播放状态

  // 同步父组件的播放状态
  useEffect(() => {
    setIsPlaying(propIsPlaying);
  }, [propIsPlaying]);

  // 处理播放/暂停
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
    onPlayPause(!isPlaying); // 通知父组件
  };

  // 自动播放逻辑
  useEffect(() => {
    if (isAudioReady && audioRef.current) {
      if (!isPlaying) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [isPlaying, musicUrl]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-300/20 p-4 z-10">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gray-600 rounded-md ml-6 mr-4">
              {imgUrl && (
                <img
                  src={imgUrl}
                  className="w-16 h-16 rounded-lg"
                  alt="Album cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-white font-medium">{musicName}</p>
            </div>
          </div>
          {musicUrl && (
            <div className="ml-10 flex-1 flex items-center gap-4">
              <button onClick={handlePlayPause} className="text-white text-2xl">
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <audio
                ref={audioRef}
                controls
                className="flex-1"
                src={musicUrl}
                onCanPlay={() => setIsAudioReady(true)}
                onLoadStart={() => setIsAudioReady(false)}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white text-2xl mr-4 hover:text-gray-300 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
