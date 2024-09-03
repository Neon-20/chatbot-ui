import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import { genSummary } from "@/lib/retrieval/summary"
import { ChatFile } from "@/types"
import Loading from "@/app/[locale]/loading"
import { MessageMarkdown } from "./messages/message-markdown"
import { Separator } from "./ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"

export function SummarySheet({
  children,
  file
}: {
  file: ChatFile
  children: React.ReactNode
}) {
  const [summaries, setSummaries] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("file_items")
          .select()
          .eq("file_id", file.id)

        if (error || !data) {
          throw new Error("Failed to fetch data")
        }

        const batches = createBatches(data)

        const summariesPromises = batches.map(async batch => {
          const batchContent = batch.map(d => d.content).join("\n")
          const summary = await genSummary(batchContent)
          if (!summary) {
            throw new Error("Failed to generate summary")
          }
          return summary
        })

        const generatedSummaries: any = await Promise.all(summariesPromises)
        setSummaries(generatedSummaries)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [file.id])

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="h-full min-w-[50%] overflow-auto scroll-smooth">
        <SheetHeader>
          <SheetTitle>Summary of {file.name}</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          summaries.map((summary, index) => (
            <React.Fragment key={index}>
              {summaries.length > 1 && (
                <div className="my-4 text-4xl font-extrabold leading-none tracking-tight">
                  Part {index + 1}
                </div>
              )}
              <Separator className="my-4" />
              <MessageMarkdown content={summary} />
            </React.Fragment>
          ))
        )}
      </SheetContent>
    </Sheet>
  )
}

function createBatches(data: any[]): any[][] {
  if (!data || !Array.isArray(data)) return []

  const batches: any[][] = []
  let currentBatch: any[] = []
  let currentTokenCount = 0
  const TOKEN_LIMIT = 100000

  for (const item of data) {
    if (currentTokenCount + item.tokens > TOKEN_LIMIT) {
      if (currentBatch.length > 0) {
        batches.push(currentBatch)
        currentBatch = []
        currentTokenCount = 0
      }
    }
    currentBatch.push(item)
    currentTokenCount += item.tokens

    if (currentTokenCount >= TOKEN_LIMIT) {
      batches.push(currentBatch)
      currentBatch = []
      currentTokenCount = 0
    }
  }
  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }

  return batches
}
