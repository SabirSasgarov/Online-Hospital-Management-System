using HMS.Application.Dashboard.DTOs;

namespace HMS.Application.Dashboard.Queries
{
    public record GetPatientDashboardQuery(Guid PatientId, Guid UserId) : IRequest<PatientDashboardDto>;

    public class GetPatientDashboardQueryHandler(IAppDbContext db)
        : IRequestHandler<GetPatientDashboardQuery, PatientDashboardDto>
    {
        public async Task<PatientDashboardDto> Handle(
            GetPatientDashboardQuery request, CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;

            var upcomingAppts = await db.Appointments.CountAsync(
                a => a.PatientId == request.PatientId &&
                     a.ScheduledAt > now &&
                     a.Status == AppointmentStatus.Scheduled, cancellationToken);

            var activePrescriptions = await db.Prescriptions.CountAsync(
                p => p.PatientId == request.PatientId &&
                     p.Status == PrescriptionStatus.Active, cancellationToken);

            var unreadMessages = await db.Messages.CountAsync(
                m => m.ReceiverId == request.UserId && !m.IsRead, cancellationToken);

            var unreadNotifications = await db.Notifications.CountAsync(
                n => n.UserId == request.UserId && !n.IsRead, cancellationToken);

            var nextAppt = await db.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Where(a => a.PatientId == request.PatientId &&
                            a.ScheduledAt > now &&
                            a.Status == AppointmentStatus.Scheduled)
                .OrderBy(a => a.ScheduledAt)
                .Select(a => new RecentAppointmentDto
                {
                    Id                   = a.Id,
                    PatientName          = a.Patient.User.FirstName + " " + a.Patient.User.LastName,
                    DoctorName           = a.Doctor.User.FirstName  + " " + a.Doctor.User.LastName,
                    DoctorSpecialization = a.Doctor.Specialization,
                    ScheduledAt          = a.ScheduledAt,
                    Status               = a.Status.ToString(),
                    Type                 = a.Type.ToString()
                })
                .FirstOrDefaultAsync(cancellationToken);

            return new PatientDashboardDto
            {
                UpcomingAppointments  = upcomingAppts,
                ActivePrescriptions   = activePrescriptions,
                UnreadMessages        = unreadMessages,
                UnreadNotifications   = unreadNotifications,
                NextAppointment       = nextAppt
            };
        }
    }
}
