import EventCard from "../EventCard/EventCard";

type EventsGridProps = {
  events: any;
  handleRSVP: (eventId:string, userStatus: string) => void;
};

export default function EventsGrid({ events, handleRSVP }: EventsGridProps) {
  return (
    <div className='grid grid-cols-1 gap-6 p-[5%] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
      {events.map((event: any) => (
        <EventCard event={event} onRSVPClick = {handleRSVP} />
      ))}
    </div>
  );
}
