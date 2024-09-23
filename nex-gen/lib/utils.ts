import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const API_SERVER_LOCATION = process.env.API_SERVER_LOCATION

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiServerLocation() {

  if (!API_SERVER_LOCATION) {
    throw new Error("Unexpected error: Missing the environment variable API_SERVER_LOCATION");
}

  return API_SERVER_LOCATION
}
