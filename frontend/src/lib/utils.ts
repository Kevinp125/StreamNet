import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const API_BASE_URL = import.meta.env.VITE_SERVER_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchStreamerCardInfo(accessToken: string){
  try{
    





  } catch(err){








  }


}
