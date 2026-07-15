using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Patients.Commands
{
    public record CreatePatientCommand(CreatePatientDto Dto) : IRequest<Guid>;

    public class CreatePatientCommandHandler(
        IAppDbContext db,
        UserManager<AppUser> userManager,
        IMapper mapper)
        : IRequestHandler<CreatePatientCommand, Guid>
    {
        public async Task<Guid> Handle(
            CreatePatientCommand request, CancellationToken cancellationToken)
        {
            var dto = request.Dto;

            if (await userManager.FindByEmailAsync(dto.Email) is not null)
                throw new ConflictException($"A user with email '{dto.Email}' already exists.");

            var user = mapper.Map<AppUser>(dto);

            var identityResult = await userManager.CreateAsync(user, dto.Password);
            if (!identityResult.Succeeded)
            {
                var errors = identityResult.Errors
                    .ToDictionary(e => e.Code, e => new[] { e.Description });
                throw new ValidationException(errors);
            }

            await userManager.AddToRoleAsync(user, Roles.Patient);

            var patient = mapper.Map<Patient>(dto);
            patient.UserId = user.Id;

            db.Patients.Add(patient);
            await db.SaveChangesAsync(cancellationToken);

            return patient.Id;
        }
    }
}
