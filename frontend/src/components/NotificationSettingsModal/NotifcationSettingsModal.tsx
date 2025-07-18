import { X } from "lucide-react";
import DiscoverPage from "../../pages/DiscoverPage/DiscoverPage";

type NotificationSettingsModalProps = {
  onClose: () => void;
};

export default function NotificationSettingsModal({ onClose }: NotificationSettingsModalProps) {
  return (
    <section className='max-h-[80vh] w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl'>
      <header className='flex items-center justify-between border-b border-gray-200 p-6'>
        <h3 className='text-xl font-semibold'>Notification Settings 🔔</h3>
        <X
          onClick={onClose}
          className='h-6 w-6 cursor-pointer transition-transform duration-200 hover:text-red-500'
        />
      </header>

      <article className='p-6'>
        <p>Settings will go here...</p>
      </article>

      <footer className='flex justify-center border-t border-white bg-gray-100 px-6 py-4'>
        <button className='bg-twitch-purple w-3/4 cursor-pointer rounded-lg px-4 py-2 font-medium text-white'>
          Save Settings
        </button>
      </footer>
    </section>
  );
}
