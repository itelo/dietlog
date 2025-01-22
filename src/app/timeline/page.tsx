"use client"

import { Bell, MoreVertical, Plus } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Timeline() {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2">
        <span className="text-lg font-medium">10:01</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" className="fill-current">
              <path d="M12 3C7.58 3 4 6.58 4 11v4.17l-2 2V19h20v-1.83l-2-2V11c0-4.42-3.58-8-8-8zm0 14c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
            </svg>
          </div>
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" className="fill-current">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-3 rounded-sm border border-white"></div>
            <span className="text-xs">80%</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2">
        <Button variant="ghost" size="icon">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </Button>
        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6" />
          <MoreVertical className="w-6 h-6" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2 space-y-6">
        <div className="text-gray-500 text-sm">Today</div>

        <Card className="bg-zinc-900 border-none">
          <div className="flex items-center gap-3 p-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL ?? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2501.PNG-8T9LUfrP9ZQahOtZeCUZYcrDm9q1Ch.png"}`}
                alt="Spinning class"
              />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">Spinning</h3>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-400">Ana Julia</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">9:06 am</span>
          </div>
        </Card>

        <Card className="bg-zinc-900 border-none">
          <div className="flex items-center gap-3 p-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL ?? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2501.PNG-8T9LUfrP9ZQahOtZeCUZYcrDm9q1Ch.png"}`}
                alt="Academia"
              />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">Academia</h3>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback>IT</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-400">Itelo</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">8:52 am</span>
          </div>
        </Card>

        <div className="text-gray-500 text-sm">Yesterday</div>

        <Card className="bg-zinc-900 border-none">
          <div className="flex items-center gap-3 p-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL ?? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2501.PNG-8T9LUfrP9ZQahOtZeCUZYcrDm9q1Ch.png"}`}
                alt="Profile"
              />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">10o dia, nunca malhei tanto tempo...</h3>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-400">Adran Carnavale</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">8:05 pm</span>
          </div>
        </Card>

        {/* More cards following the same pattern... */}

        {/* Floating Action Button */}
        <Button className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-red-500 hover:bg-red-600" size="icon">
          <Plus className="h-6 w-6" />
        </Button>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center">
          <Button variant="ghost" className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
            </svg>
            <span className="text-xs">Details</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
            <span className="text-xs">Rankings</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <span className="text-xs">Chat</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

