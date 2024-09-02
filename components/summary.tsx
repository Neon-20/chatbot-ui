import Loading from "@/app/[locale]/loading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { genSummary } from "@/lib/retrieval/summary"
import { supabase } from "@/lib/supabase/browser-client"
import { ChatFile } from "@/types"
import { useEffect, useState } from "react"
import { MessageMarkdown } from "./messages/message-markdown"

export function SummarySheet({
  children,
  file
}: {
  file: ChatFile
  children: any
}) {
  const [content, setContent] = useState<string | null>(null)
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("file_items")
        .select()
        .eq("file_id", file.id)
        .single()
      const summary: any = await genSummary(data?.content)
      if (error) {
        setContent("No data provided")
        return
      }
      setContent(summary)
    }
    fetchContent()
  }, [])
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="h-full min-w-[50%] overflow-auto scroll-smooth">
        <SheetHeader>
          <SheetTitle>Summary of {file.name}</SheetTitle>
        </SheetHeader>
        {content ? <MessageMarkdown content={content} /> : <Loading />}
      </SheetContent>
    </Sheet>
  )
}
