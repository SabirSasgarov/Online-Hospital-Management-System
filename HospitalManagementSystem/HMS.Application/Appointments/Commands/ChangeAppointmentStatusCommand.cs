using HMS.Application.Appointments.AppointmentsDTOs;

namespace HMS.Application.Appointments.Commands
{
    public record ChangeAppointmentStatusCommand(
        Guid AppointmentId,
        ChangeAppointmentStatusDto Dto) : IRequest;

    public class ChangeAppointmentStatusCommandHandler(IAppDbContext db)
        : IRequestHandler<ChangeAppointmentStatusCommand>
    {
        public async Task Handle(
            ChangeAppointmentStatusCommand request, CancellationToken cancellationToken)
        {
            var appointment = await db.Appointments
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentId, cancellationToken)
                ?? throw new NotFoundException(nameof(Appointment), request.AppointmentId);

            // Guard invalid transitions
            if (appointment.Status == AppointmentStatus.Completed ||
                appointment.Status == AppointmentStatus.Cancelled)
                throw new ConflictException(
                    $"Cannot change status of a {appointment.Status} appointment.");

            appointment.Status = request.Dto.Status;

            // Store cancellation/no-show reason in Notes if provided
            if (!string.IsNullOrWhiteSpace(request.Dto.Reason))
                appointment.Notes = request.Dto.Reason;

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
