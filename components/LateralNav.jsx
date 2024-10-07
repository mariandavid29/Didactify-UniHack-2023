import Link from "next/link";

import createIco from "../app/assets/create.svg";
import galleryIco from "../app/assets/gallery.svg";
import leaderboardIco from "../app/assets/leaderboard.svg";

import Image from "next/image";

function LateralNav() {
  return (
    <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center justify-center gap-5 rounded-full bg-gray-600 bg-opacity-50 px-6 py-3 sm:gap-10">
      <Link href="/dashboard/createCourse">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary p-2 transition-all duration-300 hover:scale-105">
          <Image alt="create course" className="w-8" src={createIco} priority />
        </div>
      </Link>
      <Link href="/dashboard/gallery">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary p-2 transition-all duration-300 hover:scale-105">
          <Image alt="gallery" className="w-8" src={galleryIco} priority />
        </div>
      </Link>
      <Link href="/dashboard/leaderboard">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary p-2 transition-all duration-300 hover:scale-105">
          <Image
            alt="leaderboard"
            className="w-8"
            src={leaderboardIco}
            priority
          />
        </div>
      </Link>
    </div>
  );
}

export default LateralNav;
