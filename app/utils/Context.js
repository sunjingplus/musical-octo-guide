"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { cacheGet, cacheSet } from "./catch";
import { getTimestamp } from "./catch";
// import useOneTapLogin from "@/hooks/useOneTapLogin";

// 创建上下文对象
export const AppContext = createContext({});

// 创建自定义 Hook
export const useAppContext = () => useContext(AppContext);

// 上下文提供者组件
export const AppContextProvider = ({ children }) => {
//   useOneTapLogin();

  // 状态管理（移除所有类型注解）
  const [theme, setTheme] = useState("light");
  const [locale, setLocale] = useState("");
  const [isSiderOpen, setIsSiderOpen] = useState(false);
  const [isShowSignPanel, setIsShowSignPanel] = useState(false);
  const [user, setUser] = useState(null);
  const [userCredits, setUserCredits] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songTask, setSongTask] = useState(null);
  const [songTaskStep, setSongTaskStep] = useState(1);

  // 添加歌曲到播放列表
  const appendPlaylist = (newSong) => {
    console.log("添加新歌曲", newSong);
    setPlaylist((currentPlaylist) => [newSong, ...currentPlaylist]);
  };

  // 加载播放列表
  const loadPlaylist = () => {
    try {
      const _playlist = cacheGet("PLAYLIST");
      const _play_idx = cacheGet("PLAY_IDX") || "0";
      
      if (_playlist) {
        const parsedPlaylist = JSON.parse(_playlist);
        let playIndex = parseInt(_play_idx, 10);
        
        // 验证索引有效性
        if (isNaN(playIndex) || playIndex < 0 || playIndex >= parsedPlaylist.length) {
          playIndex = 0;
        }

        // 设置播放列表状态
        setPlaylist(Array.isArray(parsedPlaylist) ? parsedPlaylist : []);
        setCurrentSongIndex(playIndex);
      }
    } catch (error) {
      console.error("加载播放列表失败:", error);
      setPlaylist([]);
      setCurrentSongIndex(0);
    }
  };

  // 初始化效果（组件挂载时执行）
  useEffect(() => {
    // 加载播放列表
    loadPlaylist();

    // 主题初始化逻辑
    const initializeTheme = () => {
      const cachedTheme = cacheGet("THEME");
      const validThemes = ["dark", "light"];
      
      if (validThemes.includes(cachedTheme)) {
        setTheme(cachedTheme);
        return;
      }

      // 系统主题检测
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light");
      
      updateTheme(); // 初始设置
      mediaQuery.addEventListener("change", updateTheme);
      
      return () => mediaQuery.removeEventListener("change", updateTheme);
    };

    initializeTheme();
  }, []);

  // 播放列表缓存同步
  useEffect(() => {
    if (Array.isArray(playlist) && playlist.length > 0) {
      const expires = getTimestamp() + 2592000; // 30天有效期
      cacheSet("PLAYLIST", JSON.stringify(playlist), expires);
    }
  }, [playlist]);

  // 当前播放索引缓存同步
  useEffect(() => {
    if (typeof currentSongIndex === "number" && currentSongIndex >= 0) {
      const expires = getTimestamp() + 2592000; // 30天有效期
      cacheSet("PLAY_IDX", currentSongIndex.toString(), expires);
    }
  }, [currentSongIndex]);

  // 提供上下文值
  const contextValue = {
    // 主题相关
    theme,
    setTheme,
    
    // 本地化
    locale,
    setLocale,
    
    // UI 状态
    isSiderOpen,
    setIsSiderOpen,
    isShowSignPanel,
    setIsShowSignPanel,
    
    // 用户相关
    user,
    setUser,
    userCredits,
    setUserCredits,
    
    // 播放控制
    playlist,
    setPlaylist,
    appendPlaylist,
    currentSong,
    setCurrentSong,
    currentSongIndex,
    setCurrentSongIndex,
    
    // 任务系统
    songTask,
    setSongTask,
    songTaskStep,
    setSongTaskStep
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};