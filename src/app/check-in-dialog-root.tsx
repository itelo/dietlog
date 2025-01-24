import { create } from 'zustand'

interface CheckInDialogStore {
  state: "taking-photo" | "confirming" | null
  imageSrc: string | null
  open: () => void
  close: () => void
  onTakePhoto: (args: { imageSrc: string }) => void
}

export const useCheckInDialogStore = create<CheckInDialogStore>()((set) => ({
  state: null,
  imageSrc: null,
  open: () => set({ state: "taking-photo" }),
  close: () => set({ state: null }),
  onTakePhoto: ({imageSrc}) => set({ state: "confirming", imageSrc, }),
}))