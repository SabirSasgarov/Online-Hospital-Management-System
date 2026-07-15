using HMS.Application.Beds.BedsDTOs;

namespace HMS.Application.Beds.Commands
{
    public record UpdateBedStatusCommand(Guid BedId, UpdateBedStatusDto Dto) : IRequest;

    public class UpdateBedStatusCommandHandler(IAppDbContext db)
        : IRequestHandler<UpdateBedStatusCommand>
    {
        public async Task Handle(UpdateBedStatusCommand request, CancellationToken cancellationToken)
        {
            var bed = await db.Beds
                .FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken)
                ?? throw new NotFoundException(nameof(Bed), request.BedId);

            if (bed.Status == BedStatus.Occupied && request.Dto.Status != BedStatus.Occupied)
                bed.PatientId = null;

            bed.Status = request.Dto.Status;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
