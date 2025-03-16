"use client";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import MusicPlayer from "../../../components/Music";
import { useSession } from "next-auth/react";
import { useSignInModal } from "@/components/signinmodel";
const MusicComponent = () => {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("");
  const [musicUrl, setMusicUrl] = useState(""); // 用于音乐预览的 URL
  const [imgUrl, setImg] = useState(""); // 用于音乐预览的 URL
  const [musicName, setMusicName] = useState(""); // 用于音乐预览的 URL
  const [musiLy, setMusiLy] = useState(false);
  const [musicList, setMusicList] = useState([]); // 保存歌曲列表
  const [selectedSong, setSelectedSong] = useState(null); // 选中的歌曲
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false); // 新增播放器显示状态
  const [isPlaying, setIsPlaying] = useState(false); // 新增播放状态

  const { SignInModal, setShowSignInModal } = useSignInModal();
  const [page, setPage] = useState(1); // 当前页码
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const [isLoading, setIsLoading] = useState(false); // 是否正在加载
  const audioRef = useRef(null);
  // const [isAudioReady, setIsAudioReady] = useState(false);

  const { data: session } = useSession();
  //加载用户列表
  useEffect(() => {
    fetchMusicList();
  }, []);
  // 加载音乐列表
  const fetchMusicList = async (page = 1) => {
   
    if (isLoading || !hasMore) return; // 防止重复加载
    setIsLoading(true);
    try {
      const response = await fetch(`/api/getmusic?page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error("Failed to fetch music list");
      }
      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false); // 没有更多数据
      } else {
        setMusicList((prevList) => {
          const existingIds = new Set(prevList.map((item) => item.id));
          const newDataToAdd = data.filter((item) => !existingIds.has(item.id));
          return [...prevList, ...newDataToAdd];
        });

        setPage(page + 1); // 更新页码
      }
    } catch (error) {
      console.error("Error fetching music list:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // 触底加载更多
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
        fetchMusicList(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore]);

  //根据task_id获取歌曲信息或者歌词信息
  const getMusic = async (id) => {
    const response = await fetch(`/api/music/predictions?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      console.error("Failed to fetch music:", response.status);
      return null;
    }
    const data = await response.json();
    // console.log("Fetched data:", data);
    return data;
  };

  const retryFetchImage = async (id, type) => {
    let attempts = 0;
    const maxAttempts = 60;
    let delay = 15000; // 初始延迟时间

    while (attempts < maxAttempts) {
      const response = await getMusic(id);
      if (!response) {
        console.error("No response from getMusic");
        break;
      }
      if (
        response.code === "success" &&
        (response.data.status === "IN_PROGRESS" ||
          response.data.status === "NOT_START")
      ) {
        // console.log("Music generation in progress...");
      } else if (
        response.code === "success" &&
        response.data.status === "SUCCESS"
      ) {
        // s("Music generation succeeded");
        if (type === "TASK") {
          //获取歌词
          const text = response.data.text;
          setMusiLy(text);
        } else if (type === "MUSIC") {
          const musicData = response.data.data
            ? response.data.data.map((item) => ({
                id: item.id,
                title: item.title || "",
                imageUrl: item.image_url || "",
                audioUrl: item.audio_url || "",
                taskId: item.task_id || "",
              }))
            : [];

          if (musicData.length === 0) {
            break;
          }
          // 存储音乐数据
          // console.log("存储数据", musicData);
          await saveMusicToDatabase(musicData);
          for (const item of musicData) {
            await saveGoogleCloud(item.audioUrl);
          }
          // 更新歌曲列表
          setMusicList((prevList) => [...prevList, ...musicData]);
        }
        setSubmitting(false);
        break;
      } else if (
        response.code === "success" &&
        response.data.status === "FAILED"
      ) {
        console.error("Music generation failed");
        setSubmitting(false);

        break;
      } else {
        console.error("Unknown status:", response.data.status);
        setSubmitting(false);

        break;
      }

      attempts++;
      delay = Math.min(delay + 2000, 30000); // 增加延迟时间，最大不超过 30 秒
      // console.log(
      //   `Attempt ${attempts}, retrying in ${delay / 1000} seconds...`
      // );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (attempts >= maxAttempts) {
      setSubmitting(false);
      console.error("Max attempts reached. Failed to generate music.");
    }
  };

  // 关闭播放器
  const handleClosePlayer = () => {
    setShowPlayer(false);
    setIsPlaying(false); // 重置播放状态
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // 处理播放/暂停事件
  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
  };
  //保存存储体
  const saveGoogleCloud = async (music) => {
    let mp3Url = music;
    await fetch("/api/storeMp3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mp3Url }),
    });
  };
  //保存歌曲信息
  const saveMusicToDatabase = async (musicData) => {
    try {
      const response = await fetch("/api/saveMusic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        console.error("Failed to save music to database:", response.status);
      } else {
        console.log("Music saved successfully to database");
      }
    } catch (error) {
      console.error("Error saving music to database:", error);
    }
  };
  //提交
  const handleSubmit = async (event) => {
    if (!session) {
      setShowSignInModal(true);
    }
    setSubmitting(true);
    event.preventDefault();

    if (!title || !lyrics || !style) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = {
      prompt: lyrics,
      tags: style,
      mv: "chirp-v4",
      title: title,
    };
    //获取音乐id
    try {
      const response = await fetch("/api/music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      // console.log("res", result);
      if (!response.ok) {
        setSubmitting(false);
        alert("Failed to generate music. Please try again.");
        return;
      }
      const prediction_id = result.data;
      await retryFetchImage(prediction_id, "MUSIC");
    } catch (error) {
      setSubmitting(false);
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  //点击切换歌曲
  const handleClick = async (song) => {
    try {
      setSelectedSong(song.id);
      setMusicUrl(song.audioUrl);
      setImg(song.imageUrl);
      setMusicName(song.title);
      setShowPlayer(true);
      setIsPlaying(true); // 默认开始播放

      //当taskid存在时有歌词请求歌词
      if (song.taskId) {
        await retryFetchImage(song.taskId, "TASK");
      }
    } catch (error) {
      setSubmitting(false);
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  return (
    <div className="bg-gray-900 w-[100vw] h-[100vh]">
      <SignInModal />
      <Header />
      <div className="flex flex-col md:flex-row gap-4 p-4 h-[90vh] md:overflow-hidden pt-[10vh]">
        <div className="border-dashed border-4 border-gray-500/60 p-4 rounded-md flex-1 overflow-auto text-white">
          <form onSubmit={handleSubmit}>
            <div className="mb-10 mt-8">
              <label className="block text-sm font-medium mb-3" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-500/40 rounded-lg p-2 focus:border-gray-500 focus:outline-none bg-transparent"
                placeholder="Enter title"
                required
              />
            </div>
            <div className="mb-10">
              <label
                className="block text-sm font-medium mb-3"
                htmlFor="lyrics"
              >
                Lyrics
              </label>
              <textarea
                id="lyrics"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full h-[20vh] border border-gray-500/40 rounded-lg p-2 focus:border-gray-500 focus:outline-none bg-transparent overflow-auto"
                placeholder="Enter lyrics"
                required
              ></textarea>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" htmlFor="style">
                Style of Music
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full border border-gray-500/40 rounded-lg p-2 focus:border-gray-500 focus:outline-none bg-transparent"
                  placeholder="Enter or select style"
                />
              </div>
            </div>
            <button
              type="submit"
              className={`${
                isSubmitting ? "bg-pink-600/60" : "bg-pink-500"
              } text-white   px-4 py-2 rounded-md hover:bg-pink-600/60 transition-colors`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "正在生成..." : "Submit"}
            </button>
          </form>
        </div>
        <div className="border-dashed border-4 border-gray-500/60 p-4 rounded-md flex-1 overflow-auto">
          <div className="space-y-4">
            {musicList.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                  selectedSong === song.id
                    ? "bg-gray-800/70"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => handleClick(song)}
              >
                <div
                  className={`w-20 h-20  rounded-md overflow-hidden ${
                    selectedSong === song.id
                      ? "border-4 border-pink-500"
                      : "border-4 border-transparent hover:border-pink-500"
                  }`}
                >
                  <img
                    src={song.imageUrl}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium px-4">{song.title}</p>
                  <p className="text-gray-400 text-sm px-4">{song.style}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-dashed border-4 border-gray-500/40 p-4 rounded-md flex-1 overflow-auto">
          {/* <MusicPlayer></MusicPlayer> */}

          {/* 原来的第三个虚线框内容 */}
          <div className=" p-4 rounded-md flex-1 overflow-auto">
            <div className="flex flex-col justify-center items-center">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  className=" w-[60%] bg-gray-600 rounded-md "
                ></img>
              ) : (
                <></>
              )}
              <div class="flex flex-col justify-center items-center ">
                <p className="text-white font-medium">{musicName}</p>
                <p>{musiLy}</p>
              </div>
            </div>
          </div>
        </div>
        {/* 固定在下方的音乐播放器 */}
        {/* 使用 MusicPlayer 组件 */}
        {showPlayer && (
          <MusicPlayer
            musicUrl={musicUrl}
            imgUrl={imgUrl}
            musicName={musicName}
            isPlaying={isPlaying} // 传递播放状态
            onPlayPause={handlePlayPause} // 传递播放/暂停事件
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </div>
  );
};

export default MusicComponent;
