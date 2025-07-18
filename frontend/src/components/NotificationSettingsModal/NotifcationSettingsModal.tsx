import { X } from "lucide-react";
import { useState } from "react";

type NotificationSettingsModalProps = {
  onClose: () => void;
};

export default function NotificationSettingsModal({ onClose }: NotificationSettingsModalProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [importantEnabled, setImportantEnabled] = useState(true);
  const [generalEnabled, setGeneralEnabled] = useState(true);
  const [connectRequestEnabled, setConnectRequestEnabled] = useState(true);
  const [connectionAcceptedEnabled, setConnectionAcceptedEnabled] = useState(true);
  const [connectionDeniedEnabled, setConnectionDeniedEnabled] = useState(true);
  const [privateEventInvitationEnabled, setPrivateEventInvitationEnabled] = useState(true);
  const [eventRsvpUpdatesEnabled, setEventRsvpUpdatesEnabled] = useState(true);
  const [publicEventAnnouncementsEnabled, setPublicEventAnnouncementsEnabled] = useState(true);
  const [networkEventAnnouncementsEnabled, setNetworkEventAnnouncementsEnabled] = useState(true);

  return (
    <section className='flex max-h-[70vh] w-full max-w-xl flex-col rounded-lg bg-white'>
      {/*Header just has title and close  */}
      <header className='flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-6'>
        <h2 className='text-xl font-semibold'>Notification Settings 🔔</h2>
        <X
          onClick={onClose}
          className='h-6 w-6 cursor-pointer transition-transform duration-200 hover:text-red-500'
        />
      </header>

      {/*Main section comprises all the notification toggles */}
      <main className='flex-1 overflow-y-scroll px-8'>
        {/*This is the Push Notifications toggle has its own little section */}
        <div className='flex flex-col gap-2 border-b py-5'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'> Push Notifications</span>
            <Toggle enabled={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />
          </div>
          <p className='text-sm font-medium text-gray-500'>
            Receive in-app banner notifications for important priority alerts only
          </p>
        </div>

        {/*This section is for important notifications starts with toggle to disbale all or enable and you can select which ones */}
        <div className='flex flex-col gap-6 border-b py-5'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'> 🚨 Important Notifications</span>
            <Toggle
              enabled={importantEnabled}
              onToggle={() => {
                const newValue = !importantEnabled;
                setImportantEnabled(newValue);
                if (!newValue) {
                  {
                    /*if turning off important notifs turn off all children as well */
                  }
                  setConnectRequestEnabled(false);
                  setConnectionAcceptedEnabled(false);
                  setConnectionDeniedEnabled(false);
                  setPrivateEventInvitationEnabled(false);
                }
              }}
            />
          </div>

          <div className='pl-6'>
            <div className='flex items-center justify-between'>
              <span className={!importantEnabled ? "text-gray-500" : "text-black"}>
                Connection Request Received
              </span>
              <Toggle
                enabled={connectRequestEnabled}
                onToggle={() => setConnectRequestEnabled(!connectRequestEnabled)}
                disabled={!importantEnabled}
              />
            </div>
          </div>
          <div className='pl-6'>
            <div className='flex items-center justify-between'>
              <span className={!importantEnabled ? "text-gray-500" : "text-black"}>
                Connection Request Accepted
              </span>
              <Toggle
                enabled={connectionAcceptedEnabled}
                onToggle={() => setConnectionAcceptedEnabled(!connectionAcceptedEnabled)}
                disabled={!importantEnabled}
              />
            </div>
          </div>
          <div className='pl-6'>
            <div className='flex items-center justify-between'>
              <span className={!importantEnabled ? "text-gray-500" : "text-black"}>
                Connection Request Denied
              </span>
              <Toggle
                enabled={connectionDeniedEnabled}
                onToggle={() => setConnectionDeniedEnabled(!connectionDeniedEnabled)}
                disabled={!importantEnabled}
              />
            </div>
          </div>
          <div className='pl-6'>
            <div className='flex items-center justify-between'>
              <span className={!importantEnabled ? "text-gray-500" : "text-black"}>
                Private Event Invitation
              </span>
              <Toggle
                enabled={privateEventInvitationEnabled}
                onToggle={() => setPrivateEventInvitationEnabled(!privateEventInvitationEnabled)}
                disabled={!importantEnabled}
              />
            </div>
          </div>
        </div>

        {/*Another section but this one is for general notifications same concept as important notifications */}
        <div className='flex flex-col gap-6 border-b py-5'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'> ✉️ General Notifications</span>
            <Toggle
              enabled={generalEnabled}
              onToggle={() => {
                const newValue = !generalEnabled;
                setGeneralEnabled(newValue);
                if (!newValue) {
                  {
                    /*if turning off important notifs turn off all children as well */
                  }
                  setEventRsvpUpdatesEnabled(false);
                  setPublicEventAnnouncementsEnabled(false);
                  setNetworkEventAnnouncementsEnabled(false);
                }
              }}
            />
          </div>

          <div className='pl-6'>
            <div className='flex items-center justify-between'>
              <span className={!generalEnabled ? "text-gray-500" : "text-black"}>
                Event RSVP Updates
              </span>
              <Toggle
                enabled={eventRsvpUpdatesEnabled}
                onToggle={() => setEventRsvpUpdatesEnabled(!eventRsvpUpdatesEnabled)}
                disabled={!generalEnabled}
              />
            </div>
          </div>
          <div className='pl-6'>
            <div className='flex items-center justify-between'>
              <span className={!generalEnabled ? "text-gray-500" : "text-black"}>
                Public Event Announcements
              </span>
              <Toggle
                enabled={publicEventAnnouncementsEnabled}
                onToggle={() =>
                  setPublicEventAnnouncementsEnabled(!publicEventAnnouncementsEnabled)
                }
                disabled={!generalEnabled}
              />
            </div>
          </div>
          <div className='pl-6'>
            <div className='flex items-center justify-between'>
              <span className={!generalEnabled ? "text-gray-500" : "text-black"}>
                Network Event Announcements
              </span>
              <Toggle
                enabled={networkEventAnnouncementsEnabled}
                onToggle={() =>
                  setNetworkEventAnnouncementsEnabled(!networkEventAnnouncementsEnabled)
                }
                disabled={!generalEnabled}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className='flex flex-shrink-0 justify-center border-t border-white bg-gray-100 px-6 py-4 rounded-b-lg'>
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
