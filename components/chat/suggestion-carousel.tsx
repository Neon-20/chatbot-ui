import { IconBolt } from "@tabler/icons-react"
import { useContext, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ChatMessage } from "@/types/chat-message"
import { genSuggestions } from "@/lib/retrieval/summary"
import { Skeleton } from "../ui/skeleton"
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"
import { ChatbotUIContext } from "@/context/context"
import { supabase } from "@/lib/supabase/browser-client"

function SuggestionCarousel({
  handleSendMessage
}: {
  handleSendMessage: (
    suggestion: string,
    chatMessages: ChatMessage[],
    arg2: boolean
  ) => void
}) {
  const { chatMessages, newMessageFiles, profile } =
    useContext(ChatbotUIContext)

  const scrollRef = useRef(null)
  const [userQuery, setUserQuery] = useState<string | undefined>(undefined)
  const [filesData, setFilesData] =
    useState<{ content: string; tokens: number }[]>()
  const [suggestions, setSuggestions] = useState<string[]>(
    profile?.defaultPrompts!
  )
  const [isGenerating, setIsGenerating] = useState(false)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      ;(scrollRef.current as HTMLDivElement).scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    const fetchContent = async () => {
      if (newMessageFiles.length === 0) return // No files, nothing to fetch
      try {
        const fileId = newMessageFiles[newMessageFiles.length - 1].id
        const { data, error } = await supabase
          .from("file_items")
          .select("*")
          .eq("file_id", fileId)
        const trimmedFilesData = trimFilesDataToTokenLimit(data)
        setFilesData(trimmedFilesData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchContent()
  }, [newMessageFiles])

  useEffect(() => {
    const userMessages = chatMessages.filter(
      data => data.message.role === "assistant"
    )
    const latestUserMessage = userMessages.sort(
      (a, b) =>
        new Date(b.message.created_at).getTime() -
        new Date(a.message.created_at).getTime()
    )[0]
    setUserQuery(latestUserMessage?.message?.content)
  }, [chatMessages])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (isGenerating) return
      setIsGenerating(true)
      try {
        const fetchedSuggestions = await genSuggestions({
          userQuery: chatMessages[chatMessages.length - 1]?.message.content,
          filesData
        })
        setSuggestions(fetchedSuggestions)
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
      } finally {
        setIsGenerating(false)
      }
    }

    fetchSuggestions()
  }, [userQuery, filesData])

  return (
    <div className="flex w-full items-center">
      <Button
        onClick={() => scroll("left")}
        variant={"ghost"}
        className="rounded-full focus:outline-none"
      >
        <FaArrowCircleLeft className="size-6" />
      </Button>

      <div
        ref={scrollRef}
        className="no-scrollbar relative flex w-full space-x-2 overflow-x-auto"
      >
        {suggestions?.map((suggestion, index) => (
          <div
            key={index}
            className="flex h-full shrink-0 cursor-pointer items-center justify-center"
            onClick={() => handleSendMessage(suggestion, chatMessages, false)}
          >
            {isGenerating ? (
              <Skeleton className="h-10 w-20 rounded-lg" />
            ) : (
              <div className="flex h-full items-center space-x-1 rounded-lg px-3 py-1 hover:opacity-50">
                <IconBolt size={20} />
                <div>{suggestion}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={() => scroll("right")}
        variant={"ghost"}
        className="rounded-full focus:outline-none"
      >
        <FaArrowCircleRight className="size-6" />
      </Button>
    </div>
  )
}

export default SuggestionCarousel

function trimFilesDataToTokenLimit(
  filesData:
    | {
        content: string
        created_at: string
        file_id: string
        id: string
        local_embedding: string | null
        openai_embedding: string | null
        sharing: string
        tokens: number
        updated_at: string | null
        user_id: string
      }[]
    | null,
  tokenLimit: number = 100000
) {
  if (!filesData) return []

  let totalTokens = 0
  const trimmedFilesData: {
    content: string
    created_at: string
    file_id: string
    id: string
    local_embedding: string | null
    openai_embedding: string | null
    sharing: string
    tokens: number
    updated_at: string | null
    user_id: string
  }[] = []

  for (const file of filesData) {
    if (totalTokens + file.tokens > tokenLimit) {
      break
    }

    totalTokens += file.tokens
    trimmedFilesData.push(file)

    if (totalTokens >= tokenLimit) {
      break
    }
  }

  return trimmedFilesData
}
