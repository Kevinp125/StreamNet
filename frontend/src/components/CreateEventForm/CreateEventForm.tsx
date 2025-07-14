import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-select";
import { Input } from "../ui/input";

export default function CreateEventForm() {
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
              {/* <Select name='target_audience' required>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select your target audience' />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map(audience => (
                    <SelectItem id={audience.id} value={audience.id}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
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
