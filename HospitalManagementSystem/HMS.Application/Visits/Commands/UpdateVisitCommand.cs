using HMS.Application.Visits.VisitsDTOs;

namespace HMS.Application.Visits.Commands
{
    public record UpdateVisitCommand(Guid VisitId, UpdateVisitDto Dto) : IRequest;

    public class UpdateVisitCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateVisitCommand>
    {
        public async Task Handle(UpdateVisitCommand request, CancellationToken cancellationToken)
        {
            var visit = await db.Visits
                .FirstOrDefaultAsync(v => v.Id == request.VisitId, cancellationToken)
                ?? throw new NotFoundException(nameof(Visit), request.VisitId);

            if (visit.Status == VisitStatus.Discharged)
                throw new ConflictException("Cannot edit a discharged visit.");

            if (request.Dto.DoctorId.HasValue)
            {
                var doctorExists = await db.Doctors.AnyAsync(
                    d => d.Id == request.Dto.DoctorId.Value, cancellationToken);
                if (!doctorExists)
                    throw new NotFoundException(nameof(Doctor), request.Dto.DoctorId.Value);
            }

            if (request.Dto.BedId.HasValue && request.Dto.BedId != visit.BedId)
            {
                var bed = await db.Beds
                    .FirstOrDefaultAsync(b => b.Id == request.Dto.BedId.Value, cancellationToken)
                    ?? throw new NotFoundException(nameof(Bed), request.Dto.BedId.Value);

                if (bed.Status == BedStatus.Occupied)
                    throw new ConflictException($"Bed '{bed.BedNumber}' is already occupied.");

                // Release old bed if any
                if (visit.BedId.HasValue)
                {
                    var oldBed = await db.Beds.FindAsync([visit.BedId.Value], cancellationToken);
                    if (oldBed is not null)
                    {
                        oldBed.PatientId = null;
                        oldBed.Status    = BedStatus.Available;
                    }
                }

                bed.PatientId = visit.PatientId;
                bed.Status    = BedStatus.Occupied;
            }

            mapper.Map(request.Dto, visit);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
