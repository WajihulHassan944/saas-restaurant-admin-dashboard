"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

const USER_DATA = {
  name: "Arnold Smith",
  initials: "AS",
  avatar: "/profile.jpg",
}

export default function ProfileSection() {
  const router = useRouter();

  return (
    <Button
      variant={null}
      className="flex justify-between items-center lg:pl-[25px] gap-[24px] py-2 rounded-lg h-auto"
    >
      <div className="flex flex-col items-start justify-center">
        <span className="lg:text-base text-muted-foreground">Hello,</span>
        <span className="lg:text-base font-semibold text-foreground">{USER_DATA.name}</span>
      </div>

      <Avatar
        onClick={() => router.push("/profile")}
        className="w-10 h-10 lg:w-13 lg:h-13">
        <Image
          src={USER_DATA.avatar}
          alt={USER_DATA.name}
          width={56}
          height={56}
          quality={90}
          priority
          className="aspect-square object-cover w-full h-full"
        />
        <AvatarFallback>{USER_DATA.initials}</AvatarFallback>
      </Avatar>

    </Button>
  )
}
