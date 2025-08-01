"use client"

import { IconButton } from "@chakra-ui/react"
import { HiMiniBellAlert } from "react-icons/hi2"
import { useEffect, useRef, useState } from "react"

import classes from "./index.module.css"

type Notification = {
  id: number;
  message: string;
  time: string;
}

export const Notification = () => {
  const [showNotification, setShowNotification] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    // {
    //   id: 1,
    //   message: "Wallet XYZ already send x AVAX",
    //   time: "2 minutes ago",
    // },
    // {
    //   id: 2,
    //   message: "Wallet XYZ already send x AVAX",
    //   time: "2 minutes ago",
    // },
    // {
    //   id: 3,
    //   message: "Wallet XYZ already send x AVAX",
    //   time: "2 minutes ago",
    // },
    // {
    //   id: 4,
    //   message: "Wallet XYZ already send x AVAX",
    //   time: "2 minutes ago",
    // }
  ])

  const notificationRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
      setShowNotification(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center">
      <IconButton
        aria-label="Alert"
        onClick={() => setShowNotification(!showNotification)}
        variant="outline"
        bgColor="transparent"
        borderRadius="full"
        color="white"
        _hover={{
          bgColor: "transparent",
          color: "grey",
        }}
        height={"48px"}
        width={"48px"}
        border="1px solid grey"
        icon={<HiMiniBellAlert size={24} />}
      />
      {showNotification && (
        <div ref={notificationRef} className="absolute top-14 py-8 px-6 bg-backgroundPrimary rounded-[19px] border border-[0.5px] border-[#FFFFFF8F] min-w-fit shadow-[0px_4px_25px_0px_#00000080]">
          <h2 className="px-2 text-white text-[20px] font-normal">Notifications <span className="text-[18px] text-muted-foreground">({notifications.length})</span></h2>
          <div className={`flex flex-col mt-4 gap-3 min-w-[300px] max-h-[400px] overflow-y-scroll px-2 ${classes.scrollbarCustom}`}>
            {notifications.length > 0 ? notifications.map((notification) => (
              <div key={notification.id} className="text-white bg-backgroundSecondary rounded-[6px] p-4">
                <div className="flex items-center gap-2">
                  <img src="/ai-agents/swap.svg" alt="" />
                  <div>
                    <h3 className="text-[16px] text-[#C3C3C3] font-normal">{notification.message}</h3>
                    <p className="text-[14px] text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-white text-[16px] font-normal">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}