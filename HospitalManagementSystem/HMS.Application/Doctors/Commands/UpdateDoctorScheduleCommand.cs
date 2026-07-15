using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Doctors.Commands
{
    public record UpdateDoctorScheduleCommand(Guid DoctorId, UpdateDoctorScheduleDto Dto) : IRequest;

    public class UpdateDoctorScheduleCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateDoctorScheduleCommand>
    {
        public async Task Handle(
            UpdateDoctorScheduleCommand request, CancellationToken cancellationToken)
        {
            var doctor = await db.Doctors
                .Include(d => d.Schedules)
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId, cancellationToken)
                ?? throw new NotFoundException(nameof(Doctor), request.DoctorId);

            // Replace all schedules
            doctor.Schedules.Clear();

            foreach (var s in request.Dto.Schedules)
                doctor.Schedules.Add(mapper.Map<DoctorSchedule>(s));

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
