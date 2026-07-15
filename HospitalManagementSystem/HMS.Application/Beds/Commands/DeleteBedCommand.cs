namespace HMS.Application.Beds.Commands
{
    public record DeleteBedCommand(Guid BedId) : IRequest;

    public class DeleteBedCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteBedCommand>
    {
        public async Task Handle(DeleteBedCommand request, CancellationToken cancellationToken)
        {
            var bed = await db.Beds
                .FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken)
                ?? throw new NotFoundException(nameof(Bed), request.BedId);

            if (bed.Status == BedStatus.Occupied)
                throw new ConflictException("Cannot delete an occupied bed.");

            bed.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
