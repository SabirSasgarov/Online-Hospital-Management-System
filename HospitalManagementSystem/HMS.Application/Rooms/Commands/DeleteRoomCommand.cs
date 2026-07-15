namespace HMS.Application.Rooms.Commands
{
    public record DeleteRoomCommand(Guid RoomId) : IRequest;

    public class DeleteRoomCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteRoomCommand>
    {
        public async Task Handle(DeleteRoomCommand request, CancellationToken cancellationToken)
        {
            var room = await db.Rooms
                .Include(r => r.Beds)
                .FirstOrDefaultAsync(r => r.Id == request.RoomId, cancellationToken)
                ?? throw new NotFoundException(nameof(Room), request.RoomId);

            if (room.Beds.Any(b => b.Status == BedStatus.Occupied))
                throw new ConflictException("Cannot delete a room that has occupied beds.");

            room.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
