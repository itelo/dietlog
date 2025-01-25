"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useCheckInDialogStore } from "./check-in-dialog-root"
import { base64ToFile, useUploadThing } from "@/lib/uploadthing"
import { useAuth } from "@clerk/nextjs"
import {nanoid} from "nanoid"
import { api } from "@/trpc/react"

// export const { uploadFiles } = genUploader<OurFileRouter>({
//   package: "@uploadthing/react",
// });

export function CheckInDialog() {
  const {
    imageSrc,
    close
  } = useCheckInDialogStore()
  const {
    userId
  } = useAuth()
  const apiUtils = api.useUtils()
  const postCreateMutation = api.post.create.useMutation({
    async onSuccess() {
      await apiUtils.post.list.invalidate()
      close()
    }
  })
  const uploadThing = useUploadThing((routeRegistry) => routeRegistry.imageUploader, {
    onUploadError(e) {
      console.error("Upload error", e)
    },
    async onClientUploadComplete(res) {
      const fileURL = res[0]?.serverData.imageSrc

      if (!fileURL) {
        throw new Error("File URL not found")
      }

      if (!userId) { 
        throw new Error("User not found")
      }

      await postCreateMutation.mutateAsync({
        imageURL: fileURL,
        mealCycleVariant: "breakfast",
        timestamp: new Date().toISOString(),
      })
    },
  })

  const handlePost = async () => {
    if (!userId) { 
      throw new Error("User not found")
    }
    if (!imageSrc) {
      throw new Error("Image not found")
    }
    const file = base64ToFile(imageSrc, nanoid())
    if (!file) {
      return;
    }
    
    const response = await uploadThing.startUpload([file]);

    if (!response) {
      throw new Error("Upload failed")
    }
  }
  return (
    <div className="fixed inset-0 bg-black text-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">New Food Check-in</h1>
        </div>
        <Button variant="ghost" className="text-red-500" onClick={handlePost}>
          Post
        </Button>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Input type="text" placeholder="What did you eat?" className="bg-gray-800 border-gray-700" />
          <Textarea
            placeholder="Add notes about your meal (optional)"
            className="bg-gray-800 border-gray-700 min-h-[100px]"
          />
        </div>

        {imageSrc && <div className="space-y-4 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Image src={imageSrc} alt="food uploaded" width={80} height={80} className="h-20 w-20 bg-gray-700 rounded-lg flex items-center justify-center" />
          </div>
        </div>}

        <div className="space-y-4">
          <div>
            <Label className="text-gray-400">Diet Type</Label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Nutritional Info</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input type="number" placeholder="Calories" className="bg-gray-700 border-gray-600" />
                </div>
                <div>
                  <Input type="number" placeholder="Protein (g)" className="bg-gray-700 border-gray-600" />
                </div>
                <div>
                  <Input type="number" placeholder="Carbs (g)" className="bg-gray-700 border-gray-600" />
                </div>
                <div>
                  <Input type="number" placeholder="Fat (g)" className="bg-gray-700 border-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

