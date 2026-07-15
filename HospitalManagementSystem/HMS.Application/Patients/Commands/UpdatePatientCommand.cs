using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Patients.Commands
{
    public record UpdatePatientCommand(Guid PatientId, UpdatePatientDto Dto) : IRequest;

    public class UpdatePatientCommandHandler(
        IAppDbContext db,
        UserManager<AppUser> userManager,
        IMapper mapper)
        : IRequestHandler<UpdatePatientCommand>
    {
        public async Task Handle(
            UpdatePatientCommand request, CancellationToken cancellationToken)
        {
            var patient = await db.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == request.PatientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Patient), request.PatientId);

            mapper.Map(request.Dto, patient.User);
            mapper.Map(request.Dto, patient);

            await userManager.UpdateAsync(patient.User);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
