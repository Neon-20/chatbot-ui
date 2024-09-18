import { IconBolt } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ChatMessage } from "@/types/chat-message"
import { genSuggestions } from "@/lib/retrieval/summary"
import { Skeleton } from "../ui/skeleton"

function SuggestionCarousel({
  handleSendMessage,
  chatMessages
}: {
  handleSendMessage: (
    suggestion: string,
    chatMessages: ChatMessage[],
    arg2: boolean
  ) => void
  chatMessages: ChatMessage[]
}) {
  const scrollRef = useRef(null)
  const [userQuery, setUserQuery] = useState<string | undefined>(undefined)
  const [suggestion, setSuggestions] = useState<string[]>([
    "What is alter Domus?",
    "How does alter Domus Do Business?",
    "alter Domus deals in which sector of business?",
    "Where are the branches of alter Domus?",
    "Where is alter Domus head office located?"
  ])
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
    const userMessages = chatMessages.filter(
      data => data.message.role === "user"
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
      if (userQuery) {
        setIsGenerating(true)
        const fetchedSuggestions = await genSuggestions(userQuery)
        setSuggestions(fetchedSuggestions)
        setIsGenerating(false)
      }
    }
    fetchSuggestions()
  }, [userQuery])

  return (
    <div className="flex w-full items-center">
      <Button
        onClick={() => scroll("left")}
        variant={"ghost"}
        className="rounded-full p-2 focus:outline-none"
      >
        ←
      </Button>

      <div
        ref={scrollRef}
        className="no-scrollbar relative flex w-full space-x-4 overflow-x-auto px-2"
      >
        {suggestion.map((suggestion, index) => (
          <div
            key={index}
            className="flex h-full shrink-0 cursor-pointer items-center justify-center"
            onClick={() => {
              handleSendMessage(suggestion, chatMessages, false)
            }}
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
        className="rounded-full p-2 focus:outline-none"
      >
        →
      </Button>
    </div>
  )
}

export default SuggestionCarousel
