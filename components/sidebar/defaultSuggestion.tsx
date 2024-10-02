import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { ChatbotUIContext } from "@/context/context"
import { IconPencilPlus } from "@tabler/icons-react"
import { Check, Edit2, PlusCircle, Trash2, X } from "lucide-react"
import { useContext, useState } from "react"
import { Button } from "../ui/button"
import { updateProfile } from "@/db/profile"

const DefaultSuggestion = () => {
  const { profile, setProfile } = useContext(ChatbotUIContext)
  const [newPrompt, setNewPrompt] = useState("")
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const addPrompt = async () => {
    if (!profile) return
    if (newPrompt.trim()) {
      const updatedProfile = await updateProfile(profile?.id, {
        defaultPrompts: [...profile?.defaultPrompts, newPrompt.trim()]
      })
      setProfile(updatedProfile)
      setNewPrompt("")
    }
  }

  const deletePrompt = async (index: number) => {
    if (!profile) return
    const updatedProfile = await updateProfile(profile?.id, {
      defaultPrompts: profile?.defaultPrompts.filter((_, i) => i !== index)
    })
    setProfile(updatedProfile)
  }

  const startEdit = (index: number) => {
    if (!profile) return
    setEditIndex(index)
    setEditText(profile?.defaultPrompts[index] || "")
  }

  const saveEdit = async () => {
    if (!profile) return
    if (editIndex !== null) {
      const newPrompts = [...profile?.defaultPrompts]
      newPrompts[editIndex] = editText.trim()
      const updatedProfile = await updateProfile(profile?.id, {
        defaultPrompts: newPrompts
      })
      setProfile(updatedProfile)
      setEditIndex(null)
    }
  }

  const cancelEdit = () => {
    setEditIndex(null)
    setEditText("")
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"}>
          <IconPencilPlus size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="min-w-fit">
        <SheetHeader>
          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Edit Default Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex space-x-2">
                <Input
                  placeholder="Add a new prompt"
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && addPrompt()}
                />
                <Button onClick={addPrompt}>
                  <PlusCircle className="mr-2 size-4" /> Add
                </Button>
              </div>
              <ul className="space-y-2">
                {profile?.defaultPrompts.map((prompt, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {editIndex === index ? (
                      <>
                        <Input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="grow"
                        />
                        <Button size="icon" onClick={saveEdit}>
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="grow">{prompt}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => startEdit(index)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => deletePrompt(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default DefaultSuggestion
