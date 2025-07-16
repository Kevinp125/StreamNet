import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAuthContext } from "@/Context/AuthProvider";
import { fetchNotifications } from "@/lib/api_client";
import { setConnectionRequestStatusAndPostIfAccept } from "@/lib/api_client";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  status: string;
  priority: string;
  created_at: string;
};

export default function NotificationList() {
  const { session } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
            immediateNotifications.map(notification => <p>{`${notification.type}`}</p>)
          ) : (
            <p className='text-sm text-gray-500'>No important notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}
