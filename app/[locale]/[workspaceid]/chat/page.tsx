"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()
  const [region, setRegion] = useState<string | null>(
    localStorage.getItem("selectedRegion")
  )
  useEffect(() => {
    if (region === null) {
      localStorage.setItem("selectedRegion", "europe")
      setRegion("europe")
    }
  }, [])
  const handleRegionChange = (value: string) => {
    localStorage.setItem("selectedRegion", value)
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

          <div className="m-2 flex w-full justify-between">
            <div className="hidden lg:block">
              <QuickSettings />
            </div>
            <div className="m-3 flex items-center space-x-2">
              <Label className="hidden lg:block">Select a Region</Label>
              <Select
                value={region ?? undefined}
                onValueChange={handleRegionChange}
              >
                <SelectTrigger className="lg:w-[150px]">
                  <SelectValue placeholder="Your Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe" className="cursor-pointer">
                    Europe
                  </SelectItem>
                  <SelectItem value="non-europe" className="cursor-pointer">
                    Non Europe
                  </SelectItem>
                </SelectContent>
              </Select>
              <ChatSettings />
            </div>
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>
          <div className="flex justify-center space-x-4">
            <Link href={"/terms-and-conditions"}>
              <Button
                variant="link"
                size={"sm"}
                className="text-sm text-gray-500"
              >
                Terms & Conditions
              </Button>
            </Link>
            <Link href={"/privacy-policy"}>
              <Button
                variant="link"
                size={"sm"}
                className="text-sm text-gray-500"
              >
                Privacy Policy
              </Button>
            </Link>
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
