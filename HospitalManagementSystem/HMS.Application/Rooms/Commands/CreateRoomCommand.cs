using HMS.Application.Rooms.RoomsDTOs;

namespace HMS.Application.Rooms.Commands
{
    public record CreateRoomCommand(CreateRoomDto Dto) : IRequest<Guid>;

    public class CreateRoomCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateRoomCommand, Guid>
    {
        public async Task<Guid> Handle(CreateRoomCommand request, CancellationToken cancellationToken)
        {
            var wardExists = await db.Wards.AnyAsync(w => w.Id == request.Dto.WardId, cancellationToken);
            if (!wardExists)
                throw new NotFoundException(nameof(Ward), request.Dto.WardId);

            var duplicate = await db.Rooms.AnyAsync(
                r => r.WardId == request.Dto.WardId && r.RoomNumber == request.Dto.RoomNumber, cancellationToken);
            if (duplicate)
                throw new ConflictException($"Room '{request.Dto.RoomNumber}' already exists in this ward.");

            var room = mapper.Map<Room>(request.Dto);
            db.Rooms.Add(room);
            await db.SaveChangesAsync(cancellationToken);
            return room.Id;
        }
    }
}
