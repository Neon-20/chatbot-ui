"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import { Brand } from "@/components/ui/brand"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext, useEffect, useState } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { profile, chatMessages } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()
  const [region, setRegion] = useState<string | null>(
    profile?.roles === "user" ? "sweden" : localStorage.getItem("region")
  )
  useEffect(() => {
    if (region === null) {
      localStorage.setItem("region", "sweden")
      setRegion("sweden")
    }
  }, [])
  const handleRegionChange = (value: string) => {
    localStorage.setItem("region", value)
    setRegion(value)
    window.location.reload()
  }

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

          <div
            id="sticky-banner"
            className="fixed start-0 top-0 z-50 flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
          >
            <div className="mx-auto flex items-center">
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <span className="me-3 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-200 p-1 dark:bg-gray-600">
                  <svg
                    className="size-3 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z" />
                  </svg>
                  <span className="sr-only">Light bulb</span>
                </span>
                <span>
                  New brand identity has been launched for the{" "}
                  <a
                    href="https://flowbite.com"
                    className="inline font-medium text-blue-600 underline hover:no-underline dark:text-blue-500"
                  >
                    Flowbite Library
                  </a>
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <button
                data-dismiss-target="#sticky-banner"
                type="button"
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="size-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close banner</span>
              </button>
            </div>
          </div>

          <div className="m-2 flex w-full justify-between">
            <div className="hidden lg:block">
              {profile?.roles === "superadmin" && <QuickSettings />}
            </div>
            <div className="m-3 flex items-center space-x-2">
              {/* <Label className="hidden lg:block">Select a Region</Label> */}
              <Select
                value={region ?? undefined}
                onValueChange={handleRegionChange}
                open={profile?.roles == "user" ? false : undefined}
              >
                <SelectTrigger className="lg:w-[150px]">
                  <SelectValue placeholder="Your Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sweden" className="cursor-pointer">
                    Sweden
                  </SelectItem>
                  <SelectItem value="uksouth" className="cursor-pointer">
                    Uk South
                  </SelectItem>
                  <SelectItem value="switzerland" className="cursor-pointer">
                    Switzerland
                  </SelectItem>
                </SelectContent>
              </Select>
              <ChatSettings disabled={profile?.roles === "user"} />
            </div>
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pt-0 backdrop-blur-lg sm:w-[600px] sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
