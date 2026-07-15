namespace HMS.Application.Wards.Commands
{
    public record DeleteWardCommand(Guid WardId) : IRequest;

    public class DeleteWardCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteWardCommand>
    {
        public async Task Handle(DeleteWardCommand request, CancellationToken cancellationToken)
        {
            var ward = await db.Wards
                .Include(w => w.Rooms).ThenInclude(r => r.Beds)
                .FirstOrDefaultAsync(w => w.Id == request.WardId, cancellationToken)
                ?? throw new NotFoundException(nameof(Ward), request.WardId);

            var hasOccupied = ward.Rooms
                .SelectMany(r => r.Beds)
                .Any(b => b.Status == BedStatus.Occupied);

            if (hasOccupied)
                throw new ConflictException("Cannot delete a ward that has occupied beds.");

            ward.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
