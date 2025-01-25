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
import { useState } from "react"

const mealCycleVariants = [{
  value: "breakfast",
  label: "Café da manhã",
}, {
  value: "lunch",
  label: "Almoço",
}, {
  value: "dinner",
  label: "Jantar",
}, {
  value: "afternoon-snack",
  label: "Lanche da tarde",
}, {
  value: "evening-snack",
  label: "Lanche da noite",
}, {
  value: "morning-snack",
  label: "Late da manhã",
}, {
  value: "supper",
  label: "Ceia",
}, {
  value: "other",
  label: "Other",
}] as const

type MealCycleVariant = (typeof mealCycleVariants)[number]['value']

export function CheckInDialog() {
  const {
    imageSrc,
    close
  } = useCheckInDialogStore()
  const {
    userId
  } = useAuth()
  const [mealCycleVariant, setMealCycleVariant] = useState<MealCycleVariant | undefined>(undefined)
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

      if (!mealCycleVariant) {
        throw new Error("Meal cycle variant not found")
      }

      await postCreateMutation.mutateAsync({
        imageURL: fileURL,
        mealCycleVariant,
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


        {imageSrc && <div className="w-full flex flex-row justify-start items-start p-4 gap-2">
            <Image src={imageSrc} alt="food uploaded" width={128} height={128} className="size-32 min-h-32 min-w-32 rounded-lg object-center" />

          <div className="w-full">
            <Label className="text-gray-400">Refeição</Label>
            <Select value={mealCycleVariant} onValueChange={v => setMealCycleVariant(v as MealCycleVariant)}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent>
                {mealCycleVariants.map(mcv => <SelectItem key={mcv.value} value={mcv.value}>{mcv.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>}
    </div>
  )
}

