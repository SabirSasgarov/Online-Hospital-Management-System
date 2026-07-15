using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Doctors.Commands
{
    public record CreateDoctorCommand(CreateDoctorDto Dto) : IRequest<Guid>;

    public class CreateDoctorCommandHandler(
        IAppDbContext db,
        UserManager<AppUser> userManager,
        IMapper mapper)
        : IRequestHandler<CreateDoctorCommand, Guid>
    {
        public async Task<Guid> Handle(
            CreateDoctorCommand request, CancellationToken cancellationToken)
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

            await userManager.AddToRoleAsync(user, Roles.Doctor);

            var doctor = mapper.Map<Doctor>(dto);
            doctor.UserId = user.Id;
            doctor.Schedules = dto.Schedules
                .Select(s => mapper.Map<DoctorSchedule>(s))
                .ToList();

            db.Doctors.Add(doctor);
            await db.SaveChangesAsync(cancellationToken);

            return doctor.Id;
        }
    }
}
