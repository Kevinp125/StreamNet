import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";
import { fetchUserConnections } from "@/lib/api_client";
import { postEvent } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import type { StreamerProfile } from "@/types/AppTypes";


type EventFormProps = {
  onClose: () => void;
  loadEvents: () => void;
};
export default function CreateEventForm({ onClose, loadEvents }: EventFormProps) {
  const { session } = useAuthContext();
  const [eventModality, setEventModality] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState("");
  const [connections, setConnections] = useState<StreamerProfile[]>([]);
  const [selectedInvites, setSelectedInvites] = useState<string[]>([]);

  const PRIVACY_LEVELS = [
    { id: "private", label: "Private" },
    { id: "network", label: "Network" },
    { id: "public", label: "Public" },
  ];

  const EVENT_MODALITIES = [
    { id: "online", label: "Online" },
    { id: "in_person", label: "In Person" },
  ];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement; //getting the dom element that represents my form in browser.
    const formData = new FormData(form); //FormData is a browser api that gets all values from a form. Below we can access certain things since we labeled inputs with names

    //want to process tags user entered intp an array same strat as when they input tags to sign up
    const tagsString = formData.get("tags") as string; //as string so ts doesnt complain
    const tagsArray = tagsString ? tagsString.split(",").map(tag => tag.trim()) : []; //split by comma and then map through new array to remove whitespaces and stuff and keep tags clean

    //grab all event data with formData.get and using some of the state we already had thsi will be sent to post even api
    const eventData = {
      title: formData.get("event_name"),
      description: formData.get("description"),
      event_date: formData.get("event_datetime"),
      privacy_level: privacyLevel, //here we can just use our state since we already have it
      modality: eventModality,
      location: formData.get("location"), //will just be null if they chose online
      tags: tagsArray,
      invited_users: privacyLevel === "private" ? selectedInvites : [],
    };

    try {
      if (!session?.access_token) return;

      const result = await postEvent(session.access_token, eventData);

      //close modal if the event submission was successful
      //also refetch events to display newly added one
      if (result.success) {
        onClose();
        loadEvents();
      }
    } catch (err) {
      console.error("not succesful in posting an event to database", err);
    }
  }

  {
    /*Using useEffect to fetch a users connections on page mount that way if they click that they want to make a private event we can display to them the list of users they can invite */
  }
  useEffect(() => {
    async function loadConnections() {
      if (!session?.access_token) return;

      try {
        const userConnections = await fetchUserConnections(session.access_token);
        setConnections(userConnections);
      } catch (err) {
        console.error("Failed to load connections", err);
      }
    }

    loadConnections();
  }, [session?.access_token]);
  return (
    <>
      <Card className='relative w-[45%] items-center justify-center p-10'>
        <Button
          variant='ghost'
          size='sm'
          onClick={onClose}
          className='absolute top-3 right-3 cursor-pointer text-gray-500 hover:bg-transparent hover:text-red-600'
        >
          X
        </Button>
        <CardHeader className='w-[85%]'>
          <CardTitle> Add Event! </CardTitle>
          <CardDescription>
            Add your event details below! An event can be private (invite only), public (all
            streamers can see), or within your network (all connections can see).
          </CardDescription>
        </CardHeader>

        <CardContent className='max-h-[60vh] w-[85%] overflow-y-auto'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='event_name'>Event Name</Label>
              <Input id='event_name' name='event_name' placeholder='Event Name' required />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Describe your event...'
                required
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='event_datetime'>Date & Time</Label>
              <Input id='event_datetime' name='event_datetime' type='datetime-local' required />
            </div>

            {/*Dropdown to select the audience that streamer streams to */}
            <div className='flex flex-col gap-2'>
              <Label htmlFor='privacy_level'>Privacy Level</Label>
              <Select name='privacy_level' onValueChange={setPrivacyLevel} required>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select your events privacy level' />
                </SelectTrigger>
                <SelectContent>
                  {PRIVACY_LEVELS.map(privacyLevel => (
                    <SelectItem id={privacyLevel.id} value={privacyLevel.id}>
                      {privacyLevel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/*If user selected private as the option for the event they want to post we need to dislpay a list of their connections to choose from to invite */}
            {privacyLevel === "private" && (
              <div className='flex flex-col gap-2'>
                <Label>Invite Connections</Label>
                {/*Have it be scrollable */}
                <div className='max-h-32 overflow-y-auto rounded border p-2'>
                  {/*Check if the connections length is even greater than 0 if they have no connections they cant make a private event */}
                  {connections.length > 0 ? (
                    connections.map((connection: StreamerProfile) => (
                      <label
                        key={connection.id}
                        className='flex items-center gap-2 p-1 hover:bg-gray-50'
                      >
                        {/*Using normal input instead of Shad because shad input component is more for standard text */}
                        {/*If we check the box then we add it to the selectedInvites array otherwise (unchecked) filter it out of that array */}
                        <input
                          type='checkbox'
                          value={connection.id}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedInvites(prev => [...prev, connection.id]);
                            } else {
                              setSelectedInvites(prev => prev.filter(id => id !== connection.id));
                            }
                          }}
                        />
                        <span className='text-sm'>
                          {connection.name} (@{connection.twitchUser})
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className='text-sm text-gray-500'>No connections to invite</p>
                  )}
                </div>
                {/*Nice user experience to include how many people are being invited */}
                <p className='text-xs text-gray-500'>
                  {selectedInvites.length} connection(s) selected to be invited
                </p>
              </div>
            )}

            <div className='flex flex-col gap-2'>
              <Label htmlFor='event_modality'>Event Modality</Label>
              <Select name='event_modality' onValueChange={setEventModality} required>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select your events modality' />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_MODALITIES.map(eventModality => (
                    <SelectItem id={eventModality.id} value={eventModality.id}>
                      {eventModality.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/*If user specifies that their event is in person we want them to be able to enter the location its taking place at */}
            {eventModality === "in_person" && (
              <div className='flex flex-col gap-2'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  name='location'
                  placeholder='Enter event location...'
                  required
                />
              </div>
            )}

            <div className='flex flex-col gap-2'>
              <Label htmlFor='tags'>Event Tags</Label>
              <Input id='tags' name='tags' placeholder='valorant, fun, soccer' required />
              <p className='text-muted-foreground mt-1 text-sm'>
                Separate tags with commas (e.g., fun, soccer, chatting)
              </p>
            </div>

            <Button type='submit' className='bg-electric-indigo cursor-pointer'>
              Submit!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
