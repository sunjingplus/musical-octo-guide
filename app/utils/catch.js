// time.js 中的 getTimestamp 需要保持为普通 JavaScript 函数
// 假设 getTimestamp 返回当前时间戳（秒级）

// 从缓存获取数据
export const cacheGet = (key) => {
    // 获取带过期时间的值
    let valueWithExpires = localStorage.getItem(key);
    if (!valueWithExpires) return null;
  
    // 分割过期时间和实际值
    let valueArr = valueWithExpires.split(":");
    if (valueArr.length < 2) return null;
  
    // 解析过期时间戳
    const expiresAt = Number(valueArr[0]);
    const currTimestamp = getTimestamp();
  
    // 检查是否过期（-1 表示永不过期）
    if (expiresAt !== -1 && expiresAt < currTimestamp) {
      cacheRemove(key);
      return null;
    }
  
    // 提取并返回实际值
    return valueWithExpires.slice(valueArr[0].length + 1);
  };
  
  // 存储数据到缓存
  export const cacheSet = (key, value, expiresAt) => {
    // 拼接过期时间和值
    const valueWithExpires = `${expiresAt}:${value}`;
    localStorage.setItem(key, valueWithExpires);
  };
  
  // 移除指定缓存
  export const cacheRemove = (key) => {
    localStorage.removeItem(key);
  };
  
  // 清空所有缓存
  export const cacheClear = () => {
    localStorage.clear();
  };
  export const getTimestamp = () => {
    let time = Date.parse(new Date().toUTCString());
  
    return time / 1000;
  };
  
  export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  