import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type ProfileFormData = {
  name: string;
  date_of_birth: string;
  targetAudience: string;
  tags: string[];
};

type ExtraInfoFormProps = {
  handleFormSubmit: (formData: ProfileFormData) => void;
};

export default function ExtraInfoForm({ handleFormSubmit }: ExtraInfoFormProps) {

  const AUDIENCES = [
    {id: 'kids', label: 'Kids (0-12)'},
    {id: 'teens', label: 'Teens (13-17)'},
    {id: 'young_adults', label: 'Young Adults (18-25)'},
    {id: 'adults', label: 'Adults (26-35)'},
    {id: 'mature', label: 'Mature (35+)'},
    {id: 'all_ages', label: 'All Ages'},
  ];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement; //getting the dom element that represents my form in browser.
    const formData = new FormData(form); //FormData is a browser api that gets all values from a form. Below we can access certain things since we labeled inputs with names
    const name = formData.get("first_name") as string;
    const date_of_birth = formData.get("date_of_birth") as string;
    const targetAudience = formData.get("target_audience") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(tag => tag.trim()) : []; //once we get tags split by comma and trim out the spaces for each tag

    // Create the data object that matches your FormData type
    const profileData = {
      name,
      date_of_birth,
      targetAudience,
      tags,
    };

    handleFormSubmit(profileData);
  }
  return (
    <>
      <Card className='w-[40%] items-center justify-center p-10'>
        <CardHeader className='w-[85%]'>
          <CardTitle> Extra Information </CardTitle>
          <CardDescription>
            {" "}
            Please fill out some extra information so we can finish setting up your profile.{" "}
          </CardDescription>
        </CardHeader>

        <CardContent className='w-[85%]'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            {/* Display Name */}
            <div className='flex flex-col gap-2'>
              <Label htmlFor='first_name'>First Name</Label>
              <Input id='first_name' name='first_name' placeholder='Your first name' required />
            </div>

            {/* Date of birth picker */}
            <div className='flex flex-col gap-2'>
              <Label htmlFor='date_of_birth'>Date of Birth</Label>
              <Input id='date_of_birth' name='date_of_birth' type='date' required />
            </div>

            {/*Dropdown to select the audience that streamer streams to */}
            <div className='flex flex-col gap-2'>
              <Label htmlFor='target_audience'>Target Audience</Label>
              <Select name='target_audience' required>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select your target audience' />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map(audience => (
                    <SelectItem id={audience.id} value={audience.id}>{audience.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/*String input for tags that streamer identifies with */}
            <div className='flex flex-col gap-2'>
              <Label htmlFor='tags'>Content Tags</Label>
              <Input id='tags' name='tags' placeholder='gaming, comedy, music, tutorial' required />
              <p className='text-muted-foreground mt-1 text-sm'>
                Separate tags with commas (e.g., gaming, comedy, music)
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
