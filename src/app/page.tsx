"use client";

import { Bell, MoreVertical, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckInDialog } from "@/app/check-in-dialog";
import { CameraInterface } from "@/app/camera";
import { useCheckInDialogStore } from "@/app/check-in-dialog-root";
import { UserButton } from "@clerk/nextjs";
import { Fragment } from "react";
import * as D from "date-fns";
import * as R from "remeda";
import { api } from "@/trpc/react";

export default function Timeline() {
  const { state, open, close } = useCheckInDialogStore();

  const {
    data: posts
  } = api.post.list.useQuery();

  const groups = R.pipe(
    posts ?? [],
    R.sortBy([R.prop("timestamp"), "desc"]),
    R.groupBy((d) => D.format(d.timestamp, "yyyy-MM-dd")),
  );

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2">
          <UserButton appearance={{
            elements: {
              // button: "size-12",
              // userButtonBox: "size-12",
              avatarBox: "size-10",
            }
          }} />
          <div className="flex items-center gap-4">
            <Bell className="h-6 w-6" />
            <MoreVertical className="h-6 w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-4 py-2">
          {Object.entries(groups).map(([date, groupedPosts]) => (
            <Fragment key={date}>
              <div className="text-sm text-gray-500">
                {D.format(
                  D.parse(date, "yyyy-MM-dd", new Date()),
                  "EEEE, MMMM d",
                )}
              </div>
              <div className="w-full flex flex-col gap-2">
              {groupedPosts.map((c) => (
                <Card className="border-none bg-zinc-900" key={c.postId}>
                  <div className="flex items-center gap-3 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL ?? c.imageURL}`}
                        alt="Spinning class"
                      />
                      <AvatarFallback>SP</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">Spinning</h3>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-400">Ana Julia</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {D.format(c.timestamp, "HH:mm")}
                    </span>
                  </div>
                </Card>
              ))}
              </div>
            </Fragment>
          ))}

          {/* Floating Action Button */}
          <Button
            className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
            size="icon"
            onClick={open}
          >
            <Plus className="h-6 w-6" />
          </Button>
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t border-zinc-800 bg-zinc-900">
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
              </svg>
              <span className="text-xs">Details</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
              <span className="text-xs">Rankings</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <span className="text-xs">Chat</span>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={state !== null} onOpenChange={() => close()}>
        <DialogContent className="min-w-dvw m-0 min-h-dvh max-w-[100dvw] border-none p-0">
          {state === "taking-photo" && <CameraInterface />}
          {state === "confirming" && <CheckInDialog />}
        </DialogContent>
      </Dialog>
    </>
  );
}
