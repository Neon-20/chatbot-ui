import { ChatbotUIContext } from "@/context/context"
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLMID, ModelProvider } from "@/types"
import { IconAdjustmentsHorizontal } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { ChatSettingsForm } from "../ui/chat-settings-form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { WithTooltip } from "../ui/with-tooltip"

interface ChatSettingsProps {
  disabled: boolean
}

export const ChatSettings: FC<ChatSettingsProps> = ({ disabled }) => {
  useHotkey("i", () => handleClick())

  const {
    chatSettings,
    setChatSettings,
    models,
    availableHostedModels,
    availableLocalModels,
    availableOpenRouterModels
  } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click()
    }
  }

  useEffect(() => {
    if (!chatSettings) return

    setChatSettings({
      ...chatSettings,
      // model: "gpt-4o-mini",
      temperature: Math.min(
        chatSettings.temperature,
        CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_TEMPERATURE || 1
      ),
      contextLength: Math.min(
        chatSettings.contextLength,
        CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_CONTEXT_LENGTH || 4096
      )
    })
  }, [chatSettings?.model])

  if (!chatSettings) return null

  const allModels = [
    ...models.map(model => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platformLink: "",
      imageInput: false
    })),
    ...availableHostedModels,
    ...availableLocalModels,
    ...availableOpenRouterModels
  ]

  const fullModel = allModels.find(
    llm => llm.modelId === chatSettings.model
  ) || {
    modelId: "gpt-4o-mini" as LLMID,
    modelName: "GPT-4o Mini",
    provider: "openai" as ModelProvider,
    hostedId: "gpt-4o-mini",
    platformLink: "",
    imageInput: false
  }

  return (
    <WithTooltip
      side="top"
      delayDuration={0}
      display={<div>Select your chat model</div>}
      trigger={
        <Popover open={disabled ? false : undefined}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              className="flex items-center space-x-2"
              variant="ghost"
            >
              <div className="max-w-[120px] truncate text-lg sm:max-w-[300px] lg:max-w-[500px]">
                {fullModel?.modelName || chatSettings.model}
              </div>

              <IconAdjustmentsHorizontal size={28} />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="bg-background border-input relative flex max-h-[calc(100vh-60px)] w-[300px] flex-col space-y-4 overflow-auto rounded-lg border-2 p-6 sm:w-[350px] md:w-[400px] lg:w-[500px] dark:border-none"
            align="end"
          >
            <ChatSettingsForm
              chatSettings={chatSettings}
              onChangeChatSettings={setChatSettings}
            />
          </PopoverContent>
        </Popover>
      }
    />
  )
}
