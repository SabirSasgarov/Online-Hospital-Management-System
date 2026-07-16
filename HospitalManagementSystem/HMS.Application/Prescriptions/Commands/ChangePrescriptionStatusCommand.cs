using HMS.Application.Prescriptions.DTOs;

namespace HMS.Application.Prescriptions.Commands
{
    public record ChangePrescriptionStatusCommand(Guid PrescriptionId, ChangePrescriptionStatusDto Dto) : IRequest;

    public class ChangePrescriptionStatusCommandHandler(IAppDbContext db)
        : IRequestHandler<ChangePrescriptionStatusCommand>
    {
        public async Task Handle(ChangePrescriptionStatusCommand request, CancellationToken cancellationToken)
        {
            var prescription = await db.Prescriptions
                .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId, cancellationToken)
                ?? throw new NotFoundException(nameof(Prescription), request.PrescriptionId);

            if (prescription.Status == PrescriptionStatus.Cancelled)
                throw new ConflictException("Cancelled prescriptions cannot be changed.");

            prescription.Status = request.Dto.Status;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
