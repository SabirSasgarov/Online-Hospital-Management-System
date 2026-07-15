using HMS.Application.Appointments.AppointmentsDTOs;

namespace HMS.Application.Appointments.Commands
{
    public record UpdateAppointmentCommand(Guid AppointmentId, UpdateAppointmentDto Dto) : IRequest;

    public class UpdateAppointmentCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateAppointmentCommand>
    {
        public async Task Handle(
            UpdateAppointmentCommand request, CancellationToken cancellationToken)
        {
            var appointment = await db.Appointments
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentId, cancellationToken)
                ?? throw new NotFoundException(nameof(Appointment), request.AppointmentId);

            if (appointment.Status != AppointmentStatus.Scheduled)
                throw new ConflictException(
                    $"Only scheduled appointments can be rescheduled. Current status: {appointment.Status}.");

            // Conflict check for the new time (exclude this appointment)
            var windowStart = request.Dto.ScheduledAt.AddMinutes(-30);
            var windowEnd   = request.Dto.ScheduledAt.AddMinutes(30);

            var hasConflict = await db.Appointments.AnyAsync(a =>
                a.Id        != request.AppointmentId &&
                a.DoctorId  == appointment.DoctorId &&
                a.Status    == AppointmentStatus.Scheduled &&
                a.ScheduledAt >= windowStart &&
                a.ScheduledAt <= windowEnd,
                cancellationToken);

            if (hasConflict)
                throw new ConflictException(
                    "The doctor already has an appointment within 30 minutes of the requested time.");

            mapper.Map(request.Dto, appointment);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
