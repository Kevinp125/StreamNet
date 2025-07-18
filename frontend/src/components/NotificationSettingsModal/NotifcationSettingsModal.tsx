import { X } from "lucide-react";


type NotificationSettingsModalProps = {
  onClose: () => void;

}

export default function NotificationSettingsModal({onClose}: NotificationSettingsModalProps){
  return(
    <div className = "bg-electric-indigo">
      <X onClick = {onClose}/>
    </div>
    
  )



}