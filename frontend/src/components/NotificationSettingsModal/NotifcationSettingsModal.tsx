import { X } from "lucide-react";
import DiscoverPage from "../../pages/DiscoverPage/DiscoverPage";

type NotificationSettingsModalProps = {
  onClose: () => void;
};

export default function NotificationSettingsModal({ onClose }: NotificationSettingsModalProps) {
  return (
    <section className='bg-twitch-purple max-h-[80vh] w-full max-w-xl overflow-hidden rounded-lg shadow-xl'>
      <header className='flex items-center justify-between border-b border-gray-200 p-6'>
        <h3 className='text-xl font-semibold text-white'>Notification Settings 🔔</h3>
        <X onClick = {onClose} className='h-6 w-6 text-white cursor-pointer transition-transform duration-200 hover:text-red-500' />
      </header>

      <article></article>

      <footer></footer>
    </section>
  );
}
