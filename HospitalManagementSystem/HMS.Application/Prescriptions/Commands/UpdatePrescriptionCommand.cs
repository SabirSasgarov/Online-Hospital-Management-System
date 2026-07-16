using HMS.Application.Prescriptions.DTOs;

namespace HMS.Application.Prescriptions.Commands
{
    public record UpdatePrescriptionCommand(Guid PrescriptionId, UpdatePrescriptionDto Dto) : IRequest;

    public class UpdatePrescriptionCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdatePrescriptionCommand>
    {
        public async Task Handle(UpdatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var prescription = await db.Prescriptions
                .Include(p => p.Medications)
                .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId, cancellationToken)
                ?? throw new NotFoundException(nameof(Prescription), request.PrescriptionId);

            if (prescription.Status != PrescriptionStatus.Active)
                throw new ConflictException("Only active prescriptions can be edited.");

            if (request.Dto.Notes is not null) prescription.Notes = request.Dto.Notes;

            if (request.Dto.Medications is not null)
            {
                prescription.Medications.Clear();
                foreach (var m in request.Dto.Medications)
                    prescription.Medications.Add(mapper.Map<PrescriptionMedication>(m));
            }

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
