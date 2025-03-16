"use client";
import { useState } from "react";
import MusicCard from "./MusicCard";
import MusicPlayer from "./Music";

const MusicGrid = () => {
  // 示例数据
  const musicData = [
    {
      id: 1,
      imageUrl:
        "https://cdn2.suno.ai/image_28ef38bc-6d5b-4ab1-bf3e-6562d6bbdbfc.jpeg",
      author: "Artist 1",
      songName: "Song 1",
      audioUrl: "https://cdn1.suno.ai/28ef38bc-6d5b-4ab1-bf3e-6562d6bbdbfc.mp3",
    },
    {
      id: 2,
      imageUrl:
        "https://cdn2.suno.ai/image_28ef38bc-6d5b-4ab1-bf3e-6562d6bbdbfc.jpeg",
      author: "Artist 2",
      songName: "Song 2",
      audioUrl: "https://cdn1.suno.ai/61697280-ab8f-4ce1-9624-edec2a5a0baf.mp3",
    },
    {
      id: 3,
      imageUrl:
        "https://cdn2.suno.ai/image_28ef38bc-6d5b-4ab1-bf3e-6562d6bbdbfc.jpeg",
      author: "Artist 3",
      songName: "Song 3",
      audioUrl: "https://cdn1.suno.ai/475fa4ea-c93c-4b28-8b49-403f8856d419.mp3",
    },
    {
      id: 4,
      imageUrl:
        "https://cdn2.suno.ai/image_28ef38bc-6d5b-4ab1-bf3e-6562d6bbdbfc.jpeg",
      author: "Artist 4",
      songName: "Song 4",
      audioUrl: "https://cdn1.suno.ai/2d369e06-6f17-486a-964a-9fd1c1ce5435.mp3",
    },
  ];

  // 播放器状态
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // 新增播放状态

  // 处理 icon 点击事件
  const handleIconClick = (song) => {
    if (currentSong?.id === song.id) {
      // 如果点击的是当前歌曲，切换播放状态
      setIsPlaying((prev) => !prev);
    } else {
      // 如果点击的是新歌曲，设置当前歌曲并开始播放
      setCurrentSong(song);
      setIsPlaying(true);
      setShowPlayer(true);
    }
  };

  // 关闭播放器
  const handleClosePlayer = () => {
    setShowPlayer(false);
    setCurrentSong(null);
    setIsPlaying(false); // 重置播放状态
  };

  // 处理播放器播放/暂停事件
  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
  };

  return (
    <>
      <h1 className="text-7xl text-white  bg-gray-900 flex justify-center pb-10">Discover AI Music Generator</h1>

      <div className="flex flex-wrap gap-4 p-4 bg-gray-900 justify-center text-white">
        {musicData.map((item) => (
          <div key={item.id} className="flex-1 min-w-[200px] max-w-[300px]">
            <MusicCard
              imageUrl={item.imageUrl}
              author={item.author}
              songName={item.songName}
              isPlaying={currentSong?.id === item.id && isPlaying} // 传递播放状态
              onClick={() => handleIconClick(item)} // 传递点击事件
            />
          </div>
        ))}

        {/* 音乐播放器 */}
        {showPlayer && currentSong && (
          <MusicPlayer
            musicUrl={currentSong.audioUrl}
            imgUrl={currentSong.imageUrl}
            musicName={currentSong.songName}
            isPlaying={isPlaying} // 传递播放状态
            onPlayPause={handlePlayPause} // 传递播放/暂停事件
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </>
  );
};

export default MusicGrid;
