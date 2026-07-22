using HMS.Application.Dashboard.DTOs;

namespace HMS.Application.Dashboard.Queries
{
    public record GetDoctorDashboardQuery(Guid DoctorId) : IRequest<DoctorDashboardDto>;

    public class GetDoctorDashboardQueryHandler(IAppDbContext db)
        : IRequestHandler<GetDoctorDashboardQuery, DoctorDashboardDto>
    {
        public async Task<DoctorDashboardDto> Handle(
            GetDoctorDashboardQuery request, CancellationToken cancellationToken)
        {
            var today    = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var todayAppts = await db.Appointments.CountAsync(
                a => a.DoctorId == request.DoctorId &&
                     a.ScheduledAt >= today && a.ScheduledAt < tomorrow, cancellationToken);

            var ongoingVisits = await db.Visits.CountAsync(
                v => v.DoctorId == request.DoctorId && v.Status == VisitStatus.Ongoing, cancellationToken);

            var pendingPrescriptions = await db.Prescriptions.CountAsync(
                p => p.DoctorId == request.DoctorId && p.Status == PrescriptionStatus.Active, cancellationToken);

            // Resolve the doctor's AppUser ID first, then query LabResults
            var doctorUserId = await db.Doctors
                .Where(d => d.Id == request.DoctorId)
                .Select(d => d.UserId)
                .FirstOrDefaultAsync(cancellationToken);

            var pendingLab = doctorUserId == default ? 0 : await db.LabResults.CountAsync(
                l => l.OrderedById == doctorUserId &&
                     (l.Status == LabResultStatus.Abnormal || l.Status == LabResultStatus.Critical),
                cancellationToken);

            var schedule = await db.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Where(a => a.DoctorId == request.DoctorId &&
                            a.ScheduledAt >= today && a.ScheduledAt < tomorrow)
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
                .ToListAsync(cancellationToken);

            return new DoctorDashboardDto
            {
                TodayAppointments    = todayAppts,
                OngoingVisits        = ongoingVisits,
                PendingPrescriptions = pendingPrescriptions,
                PendingLabResults    = pendingLab,
                TodaySchedule        = schedule
            };
        }
    }
}
