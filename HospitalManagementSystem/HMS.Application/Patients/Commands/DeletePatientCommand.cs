namespace HMS.Application.Patients.Commands
{
    /// <summary>Soft-deletes the patient profile. AppUser remains intact.</summary>
    public record DeletePatientCommand(Guid PatientId) : IRequest;

    public class DeletePatientCommandHandler(IAppDbContext db)
        : IRequestHandler<DeletePatientCommand>
    {
        public async Task Handle(
            DeletePatientCommand request, CancellationToken cancellationToken)
        {
            var patient = await db.Patients
                .FirstOrDefaultAsync(p => p.Id == request.PatientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Patient), request.PatientId);

            patient.IsDeleted = true;

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
