import { IconBolt } from "@tabler/icons-react"
import { useRef } from "react"
import { Button } from "../ui/button"

function SuggestionCarousel({
  suggestion,
  handleSendMessage,
  chatMessages
}: {
  suggestion: string[]
  handleSendMessage: (
    suggestion: string,
    chatMessages: any,
    arg2: boolean
  ) => void
  chatMessages: any
}) {
  const scrollRef = useRef(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      ;(scrollRef.current as HTMLDivElement).scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      })
    }
  }

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
            <div className="flex h-full items-center space-x-1 rounded-lg px-3 py-1 hover:opacity-50">
              <IconBolt size={20} />
              <div>{suggestion}</div>
            </div>
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
