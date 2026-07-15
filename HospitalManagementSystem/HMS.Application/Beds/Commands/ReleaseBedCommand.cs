namespace HMS.Application.Beds.Commands
{
    public record ReleaseBedCommand(Guid BedId) : IRequest;

    public class ReleaseBedCommandHandler(IAppDbContext db)
        : IRequestHandler<ReleaseBedCommand>
    {
        public async Task Handle(ReleaseBedCommand request, CancellationToken cancellationToken)
        {
            var bed = await db.Beds
                .FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken)
                ?? throw new NotFoundException(nameof(Bed), request.BedId);

            if (bed.Status != BedStatus.Occupied)
                throw new ConflictException("Bed is not currently occupied.");

            bed.PatientId = null;
            bed.Status    = BedStatus.Available;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
