import { IconBolt } from "@tabler/icons-react"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ChatMessage } from "@/types/chat-message"
import { genSuggestions } from "@/lib/retrieval/summary"
import { Skeleton } from "../ui/skeleton"
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"
import { ChatbotUIContext } from "@/context/context"
import { supabase } from "@/lib/supabase/browser-client"
import { defaultSuggestion } from "@/lib/suggestion"
import { AnimatePresence, motion } from "framer-motion"

function SuggestionCarousel({
  handleSendMessage
}: {
  handleSendMessage: (
    suggestion: string,
    chatMessages: ChatMessage[],
    arg2: boolean
  ) => void
}) {
  const { chatMessages, newMessageFiles } = useContext(ChatbotUIContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [userQuery, setUserQuery] = useState<string | undefined>(undefined)
  const [filesData, setFilesData] =
    useState<{ content: string; tokens: number }[]>()
  const [suggestions, setSuggestions] = useState<string[] | undefined>(
    defaultSuggestion
  )
  const [isGenerating, setIsGenerating] = useState(false)

  const moveCarousel = useCallback(
    (newDirection: number) => {
      setDirection(newDirection)
      setCurrentIndex(prevIndex => {
        if (newDirection === -1) {
          return prevIndex === 0
            ? (suggestions?.length ?? 1) - 1
            : prevIndex - 1
        } else {
          return (prevIndex + 1) % (suggestions?.length ?? 1)
        }
      })
    },
    [suggestions?.length]
  )

  const moveLeft = useCallback(() => moveCarousel(-1), [moveCarousel])
  const moveRight = useCallback(() => moveCarousel(1), [moveCarousel])

  useEffect(() => {
    const timer = setInterval(() => {
      moveRight()
    }, 3000)

    return () => clearInterval(timer)
  }, [moveRight, moveLeft])

  useEffect(() => {
    const fetchContent = async () => {
      if (newMessageFiles.length === 0) return
      try {
        const promises = newMessageFiles.map(async file => {
          const { data, error } = await supabase
            .from("file_items")
            .select("*")
            .eq("file_id", file.id)
          if (error) {
            throw new Error("Failed to fetch data")
          }
          return data
        })
        const filesData = await Promise.all(promises)
        const trimmedFilesData = trimFilesDataToTokenLimit(filesData)
        setFilesData(trimmedFilesData.flat())
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
          userQuery: chatMessages.map(m => m.message.content).join("\n"),
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
    <div className="bg-muted/50 flex w-full items-center space-x-2 rounded-lg p-2 backdrop-blur-md  ">
      <Button
        onClick={moveLeft}
        variant={"ghost"}
        className="rounded-full focus:outline-none"
      >
        <FaArrowCircleLeft className="size-6" />
      </Button>

      <div className="relative w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute flex size-full items-center justify-start"
          >
            {suggestions && (
              <motion.div
                className="flex size-full shrink-0 cursor-pointer items-center justify-center"
                onClick={() =>
                  handleSendMessage(
                    suggestions[currentIndex],
                    chatMessages,
                    false
                  )
                }
                whileHover={{ scale: 1.05 }}
              >
                {isGenerating ? (
                  <Skeleton className="h-10 w-20 rounded-lg" />
                ) : (
                  <div className="flex h-full items-center space-x-1 rounded-lg px-3 py-1">
                    <IconBolt size={20} />
                    <div>{suggestions[currentIndex]}</div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <Button
        onClick={moveRight}
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
  filesData: { content: string; tokens: number }[][],
  tokenLimit: number = 100000
) {
  let totalTokens = 0
  const trimmedFilesData: { content: string; tokens: number }[][] = []

  for (const fileBatch of filesData) {
    const trimmedBatch: { content: string; tokens: number }[] = []

    for (const file of fileBatch) {
      if (totalTokens + file.tokens > tokenLimit) {
        break
      }

      totalTokens += file.tokens
      trimmedBatch.push(file)

      if (totalTokens >= tokenLimit) {
        break
      }
    }

    if (trimmedBatch.length > 0) {
      trimmedFilesData.push(trimmedBatch)
    }

    if (totalTokens >= tokenLimit) {
      break
    }
  }

  return trimmedFilesData
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    }
  }
}
