import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import millify from "millify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatNumber = (num: number) => {
  return millify(num, {
    precision: 1,
    units: ["", "K", "Million", "Billion", "Trillion"],
  });
}

