import { ContentType } from "@/types"
import {
  IconAdjustmentsHorizontal,
  IconBolt,
  IconBooks,
  IconFile,
  IconMessage,
  IconPencil,
  IconRobotFace,
  IconSparkles
} from "@tabler/icons-react"
import { FC, useContext } from "react"
import { TabsList } from "../ui/tabs"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { SidebarSwitchItem } from "./sidebar-switch-item"
import { ChatbotUIContext } from "@/context/context"
import AdminRolesPage from "../AdminRolesPage"

export const SIDEBAR_ICON_SIZE = 28

interface SidebarSwitcherProps {
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitcher: FC<SidebarSwitcherProps> = ({
  onContentTypeChange
}) => {
  const { profile } = useContext(ChatbotUIContext)

  const options = [
    {
      name: "Chats",
      icon: <IconMessage size={SIDEBAR_ICON_SIZE} />,
      contentType: "chats"
    },
    // {
    //   name: "Presets",
    //   icon: <IconAdjustmentsHorizontal size={SIDEBAR_ICON_SIZE} />,
    //   contentType: "presets"
    // },
    {
      name: "Prompts",
      icon: <IconPencil size={SIDEBAR_ICON_SIZE} />,
      contentType: "prompts"
    },
    // {
    //   name: "Models",
    //   icon: <IconSparkles size={SIDEBAR_ICON_SIZE} />,
    //   contentType: "models"
    // },
    {
      name: "Files",
      icon: <IconFile size={SIDEBAR_ICON_SIZE} />,
      contentType: "files"
    },
    {
      name: "Collections",
      icon: <IconBooks size={SIDEBAR_ICON_SIZE} />,
      contentType: "collections"
    },
    {
      name: "Assistants",
      icon: <IconRobotFace size={SIDEBAR_ICON_SIZE} />,
      contentType: "assistants"
    }
    // {
    //   name: "Tools",
    //   icon: <IconBolt size={SIDEBAR_ICON_SIZE} />,
    //   contentType: "tools"
    // }
  ]

  if (profile?.roles == "user") {
    return (
      <div className="flex flex-col justify-between border-r-2 pb-5">
        <TabsList className="bg-background grid h-[440px] grid-rows-7">
          <SidebarSwitchItem
            icon={<IconMessage size={SIDEBAR_ICON_SIZE} />}
            contentType="chats"
            onContentTypeChange={onContentTypeChange}
          />

          <SidebarSwitchItem
            icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
            contentType="files"
            onContentTypeChange={onContentTypeChange}
          />
          <SidebarSwitchItem
            icon={<IconPencil size={SIDEBAR_ICON_SIZE} />}
            contentType="prompts"
            onContentTypeChange={onContentTypeChange}
          />
        </TabsList>

        <div className="flex flex-col items-center space-y-4">
          {/* TODO */}
          {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

          {/* TODO */}
          {/* <Alerts /> */}

          <WithTooltip
            display={<div>Profile Settings</div>}
            trigger={<ProfileSettings />}
          />
        </div>
      </div>
    )
  }
  if (profile?.roles == "admin" || profile?.roles == "superadmin") {
    return (
      <div className="flex flex-col justify-between border-r-2 pb-5">
        <TabsList className="bg-background grid h-[440px] grid-rows-7">
          {options.map((option, index) => (
            <SidebarSwitchItem
              key={index}
              icon={option.icon}
              // @ts-ignore
              contentType={option.contentType}
              onContentTypeChange={onContentTypeChange}
            />
          ))}

          <AdminRolesPage />
        </TabsList>
        {/* <SidebarSwitchItem
          icon={<IconCrown size={SIDEBAR_ICON_SIZE} />}
          contentType={"tools"}
          onContentTypeChange={onContentTypeChange}
        /> */}

        <div className="flex flex-col items-center space-y-4">
          {/* TODO */}
          {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

          {/* TODO */}
          {/* <Alerts /> */}

          <WithTooltip
            display={<div>Profile Settings</div>}
            trigger={<ProfileSettings />}
          />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col justify-between border-r-2 pb-5">
      <TabsList className="bg-background grid h-[440px] grid-rows-7">
        {options.map((option, index) => (
          <SidebarSwitchItem
            key={index}
            icon={option.icon}
            // @ts-ignore
            contentType={option.contentType}
            onContentTypeChange={onContentTypeChange}
          />
        ))}
      </TabsList>
      <div className="flex flex-col items-center space-y-4">
        {/* TODO */}
        {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

        {/* TODO */}
        {/* <Alerts /> */}

        <WithTooltip
          display={<div>Profile Settings</div>}
          trigger={<ProfileSettings />}
        />
      </div>
    </div>
  )
}
