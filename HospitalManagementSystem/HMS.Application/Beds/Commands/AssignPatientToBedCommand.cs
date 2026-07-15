using HMS.Application.Beds.BedsDTOs;

namespace HMS.Application.Beds.Commands
{
    public record AssignPatientToBedCommand(Guid BedId, AssignPatientToBedDto Dto) : IRequest;

    public class AssignPatientToBedCommandHandler(IAppDbContext db)
        : IRequestHandler<AssignPatientToBedCommand>
    {
        public async Task Handle(AssignPatientToBedCommand request, CancellationToken cancellationToken)
        {
            var bed = await db.Beds
                .FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken)
                ?? throw new NotFoundException(nameof(Bed), request.BedId);

            if (bed.Status == BedStatus.Occupied)
                throw new ConflictException("Bed is already occupied.");

            if (bed.Status == BedStatus.Maintenance)
                throw new ConflictException("Cannot assign patient to a bed under maintenance.");

            var patient = await db.Patients
                .FirstOrDefaultAsync(p => p.Id == request.Dto.PatientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Patient), request.Dto.PatientId);

            // release any existing bed for this patient
            var currentBed = await db.Beds
                .FirstOrDefaultAsync(b => b.PatientId == patient.Id, cancellationToken);
            if (currentBed is not null)
            {
                currentBed.PatientId = null;
                currentBed.Status    = BedStatus.Available;
            }

            bed.PatientId = patient.Id;
            bed.Status    = BedStatus.Occupied;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
