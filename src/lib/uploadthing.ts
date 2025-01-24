import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

export function base64ToFile(base64String: string, fileName: string): File | null {
  // Ensure the base64 string is valid
  if (!base64String.includes(',')) {
    console.error("Invalid base64 string");
    return null;
  }

  // Split base64 string to get content type and data
  const arr = base64String.split(',');
  const mimeMatchString = arr[0]
  if (!mimeMatchString) {
    console.error("Invalid base64 format");
    return null;
  }

  const mimeMatch = /:(.*?);/.exec(mimeMatchString);
  const mime = mimeMatch ? mimeMatch[1] : '';

  if (!mime) {
    console.error("Could not determine MIME type");
    return null;
  }

  const bypes = arr[1]

  if (!bypes) {
    console.error("Invalid base64 format");
    return null;
  }

  const byteCharacters = atob(bypes);
  const byteNumbers = new Array(byteCharacters.length) as number[];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileName, { type: mime });
}