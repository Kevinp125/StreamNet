import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAuthContext } from "@/Context/AuthProvider";
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
}
