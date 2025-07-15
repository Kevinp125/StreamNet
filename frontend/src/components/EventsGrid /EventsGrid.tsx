type EventsGridProps = {
  events: any;
};

export default function EventsGrid({ events }: EventsGridProps) {
  return (
    <div className='grid grid-cols-1 gap-6 p-[5%] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
      {events.map((event: any) => {
        return(
          <p key = {event.id}>{event.title}</p>
        )
      })}
    </div>
  );
}
