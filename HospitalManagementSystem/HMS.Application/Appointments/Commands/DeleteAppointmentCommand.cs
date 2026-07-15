namespace HMS.Application.Appointments.Commands
{
    /// <summary>Hard-deletes (admin only). Soft-delete not used for appointments — cancelled is the soft form.</summary>
    public record DeleteAppointmentCommand(Guid AppointmentId) : IRequest;

    public class DeleteAppointmentCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteAppointmentCommand>
    {
        public async Task Handle(
            DeleteAppointmentCommand request, CancellationToken cancellationToken)
        {
            var appointment = await db.Appointments
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentId, cancellationToken)
                ?? throw new NotFoundException(nameof(Appointment), request.AppointmentId);

            appointment.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
