namespace HMS.Application.Notifications.Commands
{
    /// <summary>
    /// Finds upcoming, still-scheduled appointments that fall in a window around
    /// <see cref="HoursAhead"/> hours from now and haven't been reminded about yet, emails the
    /// patient a reminder, and drops an in-app notification. Used both by the automatic hourly
    /// background job and by the manual "Send Reminders Now" action nurses/admins can trigger.
    /// </summary>
    public record SendAppointmentRemindersCommand(int HoursAhead = 24, int WindowHours = 2) : IRequest<int>;

    public class SendAppointmentRemindersCommandHandler(IAppDbContext db, IEmailService emailService)
        : IRequestHandler<SendAppointmentRemindersCommand, int>
    {
        public async Task<int> Handle(SendAppointmentRemindersCommand request, CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;
            var windowStart = now.AddHours(request.HoursAhead - request.WindowHours / 2.0);
            var windowEnd = now.AddHours(request.HoursAhead + request.WindowHours / 2.0);

            var appointments = await db.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Where(a => a.Status == AppointmentStatus.Scheduled
                    && a.ReminderSentAt == null
                    && a.ScheduledAt >= windowStart
                    && a.ScheduledAt <= windowEnd)
                .ToListAsync(cancellationToken);

            var sentCount = 0;
            foreach (var appointment in appointments)
            {
                var patientUser = appointment.Patient.User;
                var doctorName = $"{appointment.Doctor.User.FirstName} {appointment.Doctor.User.LastName}";

                if (!string.IsNullOrWhiteSpace(patientUser.Email))
                {
                    await emailService.SendAppointmentReminderAsync(
                        patientUser.Email, $"{patientUser.FirstName} {patientUser.LastName}",
                        doctorName, appointment.ScheduledAt, cancellationToken);
                }

                db.Notifications.Add(new Notification
                {
                    UserId = patientUser.Id,
                    Title = "Appointment Reminder",
                    Content = $"Reminder: you have an appointment with Dr. {doctorName} on {appointment.ScheduledAt:f}.",
                    Type = NotificationType.AppointmentReminder,
                    RelatedEntityId = appointment.Id,
                });

                appointment.ReminderSentAt = now;
                sentCount++;
            }

            if (sentCount > 0)
                await db.SaveChangesAsync(cancellationToken);

            return sentCount;
        }
    }
}
