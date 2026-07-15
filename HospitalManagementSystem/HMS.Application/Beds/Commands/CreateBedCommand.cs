using HMS.Application.Beds.BedsDTOs;

namespace HMS.Application.Beds.Commands
{
    public record CreateBedCommand(CreateBedDto Dto) : IRequest<Guid>;

    public class CreateBedCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateBedCommand, Guid>
    {
        public async Task<Guid> Handle(CreateBedCommand request, CancellationToken cancellationToken)
        {
            var roomExists = await db.Rooms.AnyAsync(r => r.Id == request.Dto.RoomId, cancellationToken);
            if (!roomExists)
                throw new NotFoundException(nameof(Room), request.Dto.RoomId);

            var duplicate = await db.Beds.AnyAsync(
                b => b.RoomId == request.Dto.RoomId && b.BedNumber == request.Dto.BedNumber, cancellationToken);
            if (duplicate)
                throw new ConflictException($"Bed '{request.Dto.BedNumber}' already exists in this room.");

            var bed = mapper.Map<Bed>(request.Dto);
            bed.Status = BedStatus.Available;
            db.Beds.Add(bed);
            await db.SaveChangesAsync(cancellationToken);
            return bed.Id;
        }
    }
}
