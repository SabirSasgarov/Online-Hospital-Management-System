using HMS.Application.Prescriptions.DTOs;

namespace HMS.Application.Prescriptions.Commands
{
    public record CreatePrescriptionCommand(CreatePrescriptionDto Dto) : IRequest<Guid>;

    public class CreatePrescriptionCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreatePrescriptionCommand, Guid>
    {
        public async Task<Guid> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var visitExists = await db.Visits.AnyAsync(v => v.Id == request.Dto.VisitId, cancellationToken);
            if (!visitExists) throw new NotFoundException(nameof(Visit), request.Dto.VisitId);

            var prescription = mapper.Map<Prescription>(request.Dto);
            prescription.Medications = request.Dto.Medications
                .Select(m => mapper.Map<PrescriptionMedication>(m))
                .ToList();

            db.Prescriptions.Add(prescription);
            await db.SaveChangesAsync(cancellationToken);
            return prescription.Id;
        }
    }
}
