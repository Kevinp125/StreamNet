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


  
}
