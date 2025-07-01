import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

//all shadcn component links
//Input: https://ui.shadcn.com/docs/components/input
//Label: https://ui.shadcn.com/docs/components/label
//Select: https://ui.shadcn.com/docs/components/select
//Button: https://ui.shadcn.com/docs/components/button
//Card: https://ui.shadcn.com/docs/components/card


export default function ExtraInfoForm() {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    //TODO: call a function in here that was one passed in so we can give parent information on what was submitted from form
  }
  return (
    <>
      <Card className="w-[40%] items-center justify-center p-10">
        <CardHeader className="w-[85%]">
          <CardTitle> Extra Information </CardTitle>
          <CardDescription>
            {" "}
            Please fill out some extra information so we can finish setting up your
            profile.{" "}
          </CardDescription>
        </CardHeader>

        <CardContent className="w-[85%]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Display Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="display_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Your first name"
                required
              />
            </div>

            {/* Date of birth picker */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input id="date_of_birth" name="date_of_birth" type="date" required />
            </div>

            {/*Dropdown to select the audience that streamer streams to */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Select name="target_audience" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kids">Kids (0-12)</SelectItem>
                  <SelectItem value="teens">Teens (13-17)</SelectItem>
                  <SelectItem value="young_adults">Young Adults (18-25)</SelectItem>
                  <SelectItem value="adults">Adults (26-35)</SelectItem>
                  <SelectItem value="mature">Mature (35+)</SelectItem>
                  <SelectItem value="all_ages">All Ages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/*String input for tags that streamer identifies with */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="tags">Content Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="gaming, comedy, music, tutorial"
                required
              />
              <p className="text-muted-foreground mt-1 text-sm">
                Separate tags with commas (e.g., gaming, comedy, music)
              </p>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="bg-electric-indigo cursor-pointer">
            Submit!
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
