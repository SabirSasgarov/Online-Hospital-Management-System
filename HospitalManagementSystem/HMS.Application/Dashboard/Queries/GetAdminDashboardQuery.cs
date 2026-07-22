using HMS.Application.Dashboard.DTOs;

namespace HMS.Application.Dashboard.Queries
{
    public record GetAdminDashboardQuery : IRequest<AdminDashboardDto>;

    public class GetAdminDashboardQueryHandler(IAppDbContext db)
        : IRequestHandler<GetAdminDashboardQuery, AdminDashboardDto>
    {
        public async Task<AdminDashboardDto> Handle(
            GetAdminDashboardQuery request, CancellationToken cancellationToken)
        {
            var today     = DateTime.UtcNow.Date;
            var weekStart = today.AddDays(-(int)DateTime.UtcNow.DayOfWeek);

            var totalPatients   = await db.Patients.CountAsync(cancellationToken);
            var totalDoctors    = await db.Doctors.CountAsync(cancellationToken);
            var ongoingVisits   = await db.Visits.CountAsync(v => v.Status == VisitStatus.Ongoing, cancellationToken);
            var todayAppts      = await db.Appointments.CountAsync(
                a => a.ScheduledAt >= today && a.ScheduledAt < today.AddDays(1), cancellationToken);
            var weekAppts       = await db.Appointments.CountAsync(
                a => a.ScheduledAt >= weekStart, cancellationToken);
            var pendingLab      = await db.LabResults.CountAsync(
                l => l.Status == LabResultStatus.Abnormal || l.Status == LabResultStatus.Critical, cancellationToken);

            var beds = await db.Beds.Select(b => b.Status).ToListAsync(cancellationToken);
            var totalBeds     = beds.Count;
            var occupiedBeds  = beds.Count(s => s == BedStatus.Occupied);
            var availableBeds = beds.Count(s => s == BedStatus.Available);

            var recentAppts = await db.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .OrderByDescending(a => a.ScheduledAt)
                .Take(10)
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

            return new AdminDashboardDto
            {
                TotalPatients            = totalPatients,
                TotalDoctors             = totalDoctors,
                TotalAppointmentsToday   = todayAppts,
                AppointmentsThisWeek     = weekAppts,
                OngoingVisits            = ongoingVisits,
                TotalBeds                = totalBeds,
                OccupiedBeds             = occupiedBeds,
                AvailableBeds            = availableBeds,
                PendingLabResults        = pendingLab,
                RecentAppointments       = recentAppts
            };
        }
    }
}
