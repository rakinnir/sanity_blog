import Image from "next/image"
import Link from "next/link"
import logoDark from "../public/images/logoDark.png"
import { useSession, signIn, signOut } from "next-auth/react"
const Header = () => {
  const { data: session } = useSession()
  return (
    <div className="w-full h-20 border-b-[1px] border-b-black font-titleFont sticky top-0 bg-white z-50 px-4">
      <div className="flex items-center justify-between h-full mx-auto max-w-7xl">
        <Link href="/">
          <div>
            <Image width={80} height={80} src={logoDark} alt="logoDark" />
          </div>
        </Link>
        <div>
          <ul className="hidden gap-8 text-sm font-semibold uppercase lg:inline-flex">
            <li className="headerLi">Home</li>
            <li className="headerLi">Posts</li>
            <li className="headerLi">Pages</li>
            <li className="headerLi">Features</li>
            <li className="headerLi">Contact</li>
          </ul>
        </div>
        <div className="flex items-center gap-8 text-lg">
          <div className="flex items-center gap-1">
            <img
              className="w-8 h-8 rounded-full"
              src={
                session
                  ? session?.user!.image!
                  : "https://www.noormohammad.live/static/media/roundedProfile.477a194221d255c8ce26.png"
              }
              alt="logo"
            />
            <p className="text-sm font-medium">
              {session ? session?.user!.name : "Hello Stranger"}
            </p>
          </div>

          {session ? (
            <button
              className="uppercase text-sm border-[1px] border-primaryColor hover:border-secondaryColor px-4 py-1 font-semibold hover:text-white rounded-md hover:bg-secondaryColor transition-all duration-300 active:bg-yellow-600"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          ) : (
            <button
              className="uppercase text-sm border-[1px] border-primaryColor hover:border-secondaryColor px-4 py-1 font-semibold hover:text-white rounded-md hover:bg-secondaryColor transition-all duration-300 active:bg-yellow-600"
              onClick={() => signIn()}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
