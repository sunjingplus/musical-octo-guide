import { FiPlay, FiPause } from "react-icons/fi";

const MusicCard = ({ imageUrl, author, songName, isPlaying, onClick }) => {
  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
      {/* 图片容器 */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={songName}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        {/* 图片中心的 icon */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={onClick} // 添加点击事件
        >
          <div className="p-2 bg-black/50 rounded-full">
            {isPlaying ? (
              <FiPause className="text-white text-2xl" />
            ) : (
              <FiPlay className="text-white text-2xl" />
            )}
          </div>
        </div>
      </div>
      {/* 作者名和歌曲名 */}
      <div className="mt-4 text-center">
        <p className="text-white font-medium">{songName}</p>
        <p className="text-gray-400 text-sm">{author}</p>
      </div>
    </div>
  );
};

export default MusicCard;