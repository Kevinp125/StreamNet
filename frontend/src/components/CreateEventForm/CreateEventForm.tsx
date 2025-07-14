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

type EventFormProps = {
  onClose: () => void;
};
export default function CreateEventForm({ onClose }: EventFormProps) {
  const PRIVACY_LEVELS = [
    { id: "private", label: "Private" },
    { id: "network", label: "Network" },
    { id: "public", label: "Public" },
  ];
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  return (
    <>
      <Card className='relative w-[40%] items-center justify-center p-10'>
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

        <CardContent className='w-[85%]'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            {/* Display Name */}
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

            {/* Date of birth picker */}
            <div className='flex flex-col gap-2'>
              <Label htmlFor='date_of_birth'>Date of Birth</Label>
              <Input id='date_of_birth' name='date_of_birth' type='date' required />
            </div>

            {/*Dropdown to select the audience that streamer streams to */}
            <div className='flex flex-col gap-2'>
              <Label htmlFor='privacy_level'>Privacy Level</Label>
              <Select name='privacy_level' required>
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

            <Button type='submit' className='bg-electric-indigo cursor-pointer'>
              Submit!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
