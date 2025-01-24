"use client";

import { useRef, useCallback } from "react";
import { X, ImageIcon } from "lucide-react";
import { Camera, type CameraType } from "react-camera-pro";
import { useCheckInDialogStore } from "./check-in-dialog-root";

export function CameraInterface() {
  // const webcamRef = useRef<Webcam>(null)
  const cameraRef = useRef<CameraType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    onTakePhoto,
    close
  } = useCheckInDialogStore()

  const handleCapture = useCallback(() => {
    if (cameraRef.current) {
      const imageSrc = cameraRef.current?.takePhoto();
      if (imageSrc) {
        // Handle the captured image
        console.log("Captured:", imageSrc);
        if (typeof imageSrc === "string") {
          onTakePhoto({ imageSrc: imageSrc });
        } else {
          // onTakePhoto({ imageSrc: imageSrc.data })
        }
      }
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the selected file
      console.log("Selected file:", file);
      onTakePhoto({ imageSrc: URL.createObjectURL(file) });
    }
  };

  const handleLibrarySelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-dvh w-full bg-black text-white">
      {/* Close button */}
      <div className="relative flex w-screen items-center justify-start bg-black">
        <button className="py-4 pl-4" onClick={close}>
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Camera preview;176px bottom and 56px header */}
      <div className="relative h-[calc(100dvh-176px-56px)] w-full">
        <Camera
          ref={cameraRef}
          aspectRatio="cover"
          facingMode="environment"
          // numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
          // videoSourceDeviceId={activeDeviceId}
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
        />
      </div>

      {/* Bottom controls */}
      <div className="bg-black pt-10 flex flex-col px-4 pb-3 gap-2">
        {/* Capture button */}
        <div className="flex items-center justify-center">
            <button
              onClick={handleCapture}
              className="rounded-full border-4 border-white p-1.5"
            >
              <div className="h-12 w-12 rounded-full bg-white" />
            </button>
          </div>
        <div className="flex items-start justify-start ">
          <button
            onClick={handleLibrarySelect}
            className="flex flex-row items-center gap-2 py-3"
          >
            <ImageIcon className="h-6 w-6" />
            <span className="text-sm">From library</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
