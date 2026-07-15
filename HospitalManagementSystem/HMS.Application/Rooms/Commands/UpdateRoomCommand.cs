using HMS.Application.Rooms.RoomsDTOs;

namespace HMS.Application.Rooms.Commands
{
    public record UpdateRoomCommand(Guid RoomId, UpdateRoomDto Dto) : IRequest;

    public class UpdateRoomCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateRoomCommand>
    {
        public async Task Handle(UpdateRoomCommand request, CancellationToken cancellationToken)
        {
            var room = await db.Rooms
                .FirstOrDefaultAsync(r => r.Id == request.RoomId, cancellationToken)
                ?? throw new NotFoundException(nameof(Room), request.RoomId);

            mapper.Map(request.Dto, room);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
