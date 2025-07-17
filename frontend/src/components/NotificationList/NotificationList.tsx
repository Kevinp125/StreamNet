import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAuthContext } from "@/Context/AuthProvider";
import { fetchNotifications } from "@/lib/api_client";
import { setConnectionRequestStatusAndPostIfAccept } from "@/lib/api_client";
import { updateNotificationStatus } from "@/lib/api_client";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  contextData: any;
  status: string;
  priority: string;
  created_at: string;
};

export default function NotificationList() {
  const { session } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  //function gets called whenever an action on notification is clicked.
  //Whether it be an accept or deny or read and handles it
  async function handleAllNotificationActions(action: string, notification: Notification) {
    if (action === "accept" || action === "deny") {
      try {
        if (!session?.access_token) {
          throw Error("no valid session");
        }

        const res = await setConnectionRequestStatusAndPostIfAccept(
          session?.access_token,
          action,
          notification.contextData.request_id,
        );

        if (res.success) {
          await updateNotificationStatus(session.access_token, notification.id, "read");
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }
      } catch (err) {
        console.error("Could not process connection request", err);
      }
    } else if (action === "read") {
      try {
        if (!session?.access_token) return;

        await updateNotificationStatus(session.access_token, notification.id, "read");
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      } catch (err) {
        console.error("Could not mark notification as read", err);
      }
    }
  }

  useEffect(() => {
    async function getNotifications() {
      if (!session?.access_token) return;
      try {
        const notifications = await fetchNotifications(session.access_token);
        setNotifications(notifications);
      } catch (err) {
        console.error("Failed to get notifs", err);
      }
    }

    getNotifications();
  }, [session?.access_token]);

  //for now we want to separate the notifications whose priortiy is immediate vs the ones who have a general priortiy
  const immediateNotifications = notifications.filter(n => n.priority === "immediate");
  const generalNotifications = notifications.filter(n => n.priority === "general");

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h3 className='mb-3 text-lg font-semibold text-red-600'>🚨 Important</h3>
        <div className='flex flex-col gap-3'>
          {immediateNotifications.length > 0 ? (
            immediateNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onAction={handleAllNotificationActions}
              />
            ))
          ) : (
            <p className='text-sm text-gray-500'>No important notifications</p>
          )}
        </div>
      </div>

      <div>
        <h3 className='mb-3 text-lg font-semibold text-gray-700'>📬 General</h3>
        <div className='flex flex-col gap-3'>
          {generalNotifications.length > 0 ? (
            generalNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onAction={handleAllNotificationActions}
              />
            ))
          ) : (
            <p className='text-sm text-gray-500'>No general notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}

//this is a helper component
//it will display the notifications styled in notification list
//Takes an onAction which calls the handleAllActions parent function
//In that function we will check the action user took and the notification type.

function NotificationItem({
  notification,
  onAction,
}: {
  notification: Notification;
  onAction: (action: string, notification: Notification) => void;
}) {
  return (
    <div className='flex gap-4'>
      {/*Notification info on left side first. All notifications will have this info no matter the kind */}
      <div className='flex-1'>
        <p className='font-medium'>{notification.title}</p>
        <p className='text-sm text-gray-600'>{notification.message}</p>
        <p className='text-xs text-gray-400'>
          {new Date(notification.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>

      {/*Now below to keep it simple for now we are just going to check if
        a notification is a connection request because we need accept or deny buttons. 
        All other notifications for now just have a mark as read*/}

      {notification.type === "connection_request" ? (
        <div className='flex gap-2'>
          <Button
            onClick={() => {
              onAction("accept", notification);
            }}
            className='cursor-pointer bg-green-600'
          >
            <Check />
          </Button>
          <Button
            onClick={() => {
              onAction("deny", notification);
            }}
            variant='destructive'
            className='cursor-pointer'
          >
            <X />
          </Button>
        </div>
      ) : (
        <Button
          className='flex items-center gap-1'
          variant='ghost'
          onClick={() => onAction("read", notification)}
        >
          <span>Read</span>
          <Check />
        </Button>
      )}
    </div>
  );
}
