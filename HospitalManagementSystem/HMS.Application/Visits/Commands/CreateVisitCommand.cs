using HMS.Application.Visits.VisitsDTOs;

namespace HMS.Application.Visits.Commands
{
    public record CreateVisitCommand(CreateVisitDto Dto) : IRequest<Guid>;

    public class CreateVisitCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateVisitCommand, Guid>
    {
        public async Task<Guid> Handle(CreateVisitCommand request, CancellationToken cancellationToken)
        {
            var patient = await db.Patients
                .FirstOrDefaultAsync(p => p.Id == request.Dto.PatientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Patient), request.Dto.PatientId);

            var doctor = await db.Doctors
                .FirstOrDefaultAsync(d => d.Id == request.Dto.DoctorId, cancellationToken)
                ?? throw new NotFoundException(nameof(Doctor), request.Dto.DoctorId);

            // A patient can only have one ongoing visit at a time
            var hasOngoing = await db.Visits.AnyAsync(
                v => v.PatientId == patient.Id && v.Status == VisitStatus.Ongoing, cancellationToken);
            if (hasOngoing)
                throw new ConflictException("Patient already has an ongoing visit.");

            if (request.Dto.BedId.HasValue)
            {
                var bed = await db.Beds
                    .FirstOrDefaultAsync(b => b.Id == request.Dto.BedId.Value, cancellationToken)
                    ?? throw new NotFoundException(nameof(Bed), request.Dto.BedId.Value);

                if (bed.Status == BedStatus.Occupied)
                    throw new ConflictException($"Bed '{bed.BedNumber}' is already occupied.");

                if (bed.Status == BedStatus.Maintenance)
                    throw new ConflictException($"Bed '{bed.BedNumber}' is under maintenance.");

                bed.PatientId = patient.Id;
                bed.Status    = BedStatus.Occupied;
            }

            var visit = mapper.Map<Visit>(request.Dto);
            db.Visits.Add(visit);
            await db.SaveChangesAsync(cancellationToken);
            return visit.Id;
        }
    }
}
