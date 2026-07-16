namespace HMS.Application.Prescriptions.Commands
{
    public record DeletePrescriptionCommand(Guid PrescriptionId) : IRequest;

    public class DeletePrescriptionCommandHandler(IAppDbContext db)
        : IRequestHandler<DeletePrescriptionCommand>
    {
        public async Task Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var prescription = await db.Prescriptions
                .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId, cancellationToken)
                ?? throw new NotFoundException(nameof(Prescription), request.PrescriptionId);

            if (prescription.Status == PrescriptionStatus.Active)
                throw new ConflictException("Cannot delete an active prescription. Cancel it first.");

            prescription.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
