import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/Context/AuthProvider";
import { updateNotificationSettings } from "@/lib/api_client";
import { getNotificationSettings } from "@/lib/api_client";

type NotificationSettingsModalProps = {
  onClose: () => void;
};

export default function NotificationSettingsModal({ onClose }: NotificationSettingsModalProps) {
  const { session } = useAuthContext();
  const [pushEnabled, setPushEnabled] = useState<boolean | undefined>(undefined);
  const [importantEnabled, setImportantEnabled] = useState<boolean | undefined>(undefined);
  const [generalEnabled, setGeneralEnabled] = useState<boolean | undefined>(undefined);
  const [connectRequestEnabled, setConnectRequestEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const [connectionAcceptedEnabled, setConnectionAcceptedEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const [connectionDeniedEnabled, setConnectionDeniedEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const [privateEventInvitationEnabled, setPrivateEventInvitationEnabled] = useState<
    boolean | undefined
  >(undefined);
  const [eventRsvpUpdatesEnabled, setEventRsvpUpdatesEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const [publicEventAnnouncementsEnabled, setPublicEventAnnouncementsEnabled] = useState<
    boolean | undefined
  >(undefined);
  const [networkEventAnnouncementsEnabled, setNetworkEventAnnouncementsEnabled] = useState<
    boolean | undefined
  >(undefined);

  const [loading, setLoading] = useState(true);

  async function handleSave() {
    if (!session?.access_token) return;

    try {
      await updateNotificationSettings(session.access_token, {
        push_enabled: pushEnabled,
        important_enabled: importantEnabled,
        general_enabled: generalEnabled,
        connection_request_enabled: connectRequestEnabled,
        connection_accepted_enabled: connectionAcceptedEnabled,
        connection_denied_enabled: connectionDeniedEnabled,
        private_event_invitation_enabled: privateEventInvitationEnabled,
        event_rsvp_updates_enabled: eventRsvpUpdatesEnabled,
        public_event_announcements_enabled: publicEventAnnouncementsEnabled,
        network_event_announcements_enabled: networkEventAnnouncementsEnabled,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  useEffect(() => {
    async function loadSettings() {
      if (!session?.access_token) return;
      try {
        const settings = await getNotificationSettings(session?.access_token);
        setPushEnabled(settings.push_enabled);
        setImportantEnabled(settings.important_enabled);
        setGeneralEnabled(settings.general_enabled);
        setConnectRequestEnabled(settings.connection_request_enabled);
        setConnectionAcceptedEnabled(settings.connection_accepted_enabled);
        setConnectionDeniedEnabled(settings.connection_denied_enabled);
        setPrivateEventInvitationEnabled(settings.private_event_invitation_enabled);
        setEventRsvpUpdatesEnabled(settings.event_rsvp_updates_enabled);
        setPublicEventAnnouncementsEnabled(settings.public_event_announcements_enabled);
        setNetworkEventAnnouncementsEnabled(settings.network_event_announcements_enabled);
      } catch (err) {
        console.error("Failed to load notification settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [session?.access_token]);
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

        {loading ? (
          <div className='flex items-center justify-center py-16'>
            <div className='text-gray-500'>Loading settings...</div>
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-2 border-b py-5'>
              <div className='flex items-center justify-between'>
                <span className='font-medium'> Push Notifications</span>
                <Toggle enabled={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />
              </div>
              <p className='text-sm font-medium text-gray-500'>
                Receive in-app banner notifications for important priority alerts only
              </p>
            </div>

            <div className='flex flex-col gap-6 border-b py-5'>
              <div className='flex items-center justify-between'>
                <span className='font-medium'> 🚨 Important Notifications</span>
                <Toggle
                  enabled={importantEnabled}
                  onToggle={() => {
                    const newValue = !importantEnabled;
                    setImportantEnabled(newValue);
                    if (!newValue) {
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
                    onToggle={() =>
                      setPrivateEventInvitationEnabled(!privateEventInvitationEnabled)
                    }
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
          </>
        )}
      </main>

      <footer className='flex flex-shrink-0 justify-center rounded-b-lg border-t border-white bg-gray-100 px-6 py-4'>
        <button
          onClick={handleSave}
          className='bg-twitch-purple w-3/4 cursor-pointer rounded-lg px-4 py-2 font-medium text-white'
        >
          {loading ? "Loading..." : "Save Settings"}
        </button>
      </footer>
    </section>
  );
}

type ToggleProps = {
  enabled: boolean | undefined;
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
