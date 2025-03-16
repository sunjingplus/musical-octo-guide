/*
 * @Author: Zane
 * @Date: 2024-03-15 18:34:57
 * @Description:
 * @LastEditors: Zane zanekwok73@gmail.com
 * @LastEditTime: 2024-03-15 18:37:25
 */


// import { Icons } from "@/components/community/icons";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { UserInfo } from "@/types/user";


export function UserAvatar({ user, ...props }) {
  return (
    <>
      <div>
        {user.avatar ? (
          <img alt="Picture" src={user.avatar} />
        ) : (
          <span className="sr-only">{user.username}</span>
        )}
      </div>
    </>
  );
}
