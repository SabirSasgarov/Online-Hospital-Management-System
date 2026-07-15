using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Doctors.Commands
{
    public record UpdateDoctorCommand(Guid DoctorId, UpdateDoctorDto Dto) : IRequest;

    public class UpdateDoctorCommandHandler(
        IAppDbContext db,
        UserManager<AppUser> userManager,
        IMapper mapper)
        : IRequestHandler<UpdateDoctorCommand>
    {
        public async Task Handle(
            UpdateDoctorCommand request, CancellationToken cancellationToken)
        {
            var doctor = await db.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId, cancellationToken)
                ?? throw new NotFoundException(nameof(Doctor), request.DoctorId);

            mapper.Map(request.Dto, doctor.User);
            mapper.Map(request.Dto, doctor);

            await userManager.UpdateAsync(doctor.User);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
