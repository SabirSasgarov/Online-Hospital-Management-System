using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Doctors.Commands
{
    public record ToggleDoctorAvailabilityCommand(Guid DoctorId, UpdateDoctorAvailabilityDto Dto) : IRequest;

    public class ToggleDoctorAvailabilityCommandHandler(IAppDbContext db)
        : IRequestHandler<ToggleDoctorAvailabilityCommand>
    {
        public async Task Handle(
            ToggleDoctorAvailabilityCommand request, CancellationToken cancellationToken)
        {
            var doctor = await db.Doctors
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId, cancellationToken)
                ?? throw new NotFoundException(nameof(Doctor), request.DoctorId);

            doctor.IsAvailable = request.Dto.IsAvailable;

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
