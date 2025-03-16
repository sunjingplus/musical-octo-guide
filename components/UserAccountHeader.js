"use client";
import { signOut, useSession } from "next-auth/react";
import { useSignInModal } from "./signinmodel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserAccountHeader() {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { data: session } = useSession();
  const user = {
    userId: session && session?.user.id,
    username: session && session?.user.name,
    email: session && session?.user.email,
    avatar: session && session?.user.image,
  };
  const handleLogIn = () => {
    setShowSignInModal(true);
  };
  return (
    <>
      <SignInModal />
      {user && user.username ? (
        <div className="w-full h-full flex items-center content-center">
          <div className="">
            {/* {user.role && user.role > 1 ? <></> : <></>} */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div>
                {user.avatar ? (
                  <img
                    alt="Picture"
                    src={user.avatar}
                    className="rounded-full h-10 w-10"
                  />
                ) : (
                  <span className="sr-only">{user.username}</span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-4 bg-gray-100 ">
              <div className="text-center">
                <DropdownMenuItem className="cursor-pointer">
                  {user.username}
                </DropdownMenuItem>
              </div>

              {user.email && (
                <DropdownMenuItem className="cursor-pointer">
                  {user.email}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault();
                  signOut({ callbackUrl: process.env.NEXTAUTH_URL });
                }}
              >
                Sign out
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="w-full   h-full mr-4 flex items-center content-center ">
          <button
            onClick={handleLogIn}
            className={
              "bg-gray-800 text-white hover:bg-[#FD7A20] px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap"
            }
          >
            Log in
          </button>
        </div>
      )}
    </>
  );
}
