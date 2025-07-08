import { useEffect, useState } from "react";
import StreamerGrid from "@/components/StreamerGrid/StreamerGrid";
import StreamerCard from "@/components/StreamerCard/StreamerCard";
import { getUserConnections } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import type { StreamerProfile } from "@/types/AppTypes";


export default function SavedConnectionsPage(){
  return(
    <p className = "text-white">In Saved Connections</p>
  )
}