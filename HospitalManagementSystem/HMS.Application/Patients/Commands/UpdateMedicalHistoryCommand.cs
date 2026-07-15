using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Patients.Commands
{
    public record UpdateMedicalHistoryCommand(Guid PatientId, UpdateMedicalHistoryDto Dto) : IRequest;

    public class UpdateMedicalHistoryCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateMedicalHistoryCommand>
    {
        public async Task Handle(
            UpdateMedicalHistoryCommand request, CancellationToken cancellationToken)
        {
            var patient = await db.Patients
                .FirstOrDefaultAsync(p => p.Id == request.PatientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Patient), request.PatientId);

            mapper.Map(request.Dto, patient);

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
