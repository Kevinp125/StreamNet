import { X } from "lucide-react";
import { useState } from "react";
import NotificationList from "../NotificationList/NotificationList";

type NotificationSettingsModalProps = {
  onClose: () => void;
};

export default function NotificationSettingsModal({ onClose }: NotificationSettingsModalProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [immediateEnabled, setImmediateEnabled] = useState(true);
  const [generalEnabled, setGeneralEnabled] = useState(true);

  return (
    <section className='max-h-[80vh] w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl'>
      <header className='flex items-center justify-between border-b border-gray-200 p-6'>
        <h2 className='text-xl font-semibold'>Notification Settings 🔔</h2>
        <X
          onClick={onClose}
          className='h-6 w-6 cursor-pointer transition-transform duration-200 hover:text-red-500'
        />
      </header>

      <main className='p-6'>
        <div className='flex items-center justify-between'>
          <span className='font-medium'> Push Notifications</span>
          <Toggle enabled={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />
        </div>
      </main>

      <footer className='flex justify-center border-t border-white bg-gray-100 px-6 py-4'>
        <button className='bg-twitch-purple w-3/4 cursor-pointer rounded-lg px-4 py-2 font-medium text-white'>
          Save Settings
        </button>
      </footer>
    </section>
  );
}

type ToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
};
//helper toggle component that will be called in the settings modal
function Toggle({ enabled, onToggle, disabled = false }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        disabled ? "cursor-not-allowed bg-gray-200" : enabled ? "bg-twitch-purple" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`}
      ></span>
    </button>
  );
}
