import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target: targetLanguage }),
  });
  if (!response.ok) {
    throw new Error("Translation failed");
  }
  const data = await response.json();
  return data.translation;
} 