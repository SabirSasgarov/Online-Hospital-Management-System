namespace HMS.Application.Dashboard.DTOs
{
    // Admin dashboard
    public class AdminDashboardDto
    {
        public int TotalPatients { get; set; }
        public int TotalDoctors { get; set; }
        public int TotalAppointmentsToday { get; set; }
        public int OngoingVisits { get; set; }
        public int AvailableBeds { get; set; }
        public int OccupiedBeds { get; set; }
        public int TotalBeds { get; set; }
        public int PendingLabResults { get; set; }
        public int AppointmentsThisWeek { get; set; }
        public List<RecentAppointmentDto> RecentAppointments { get; set; } = [];
    }

    // Doctor dashboard
    public class DoctorDashboardDto
    {
        public int TodayAppointments { get; set; }
        public int OngoingVisits { get; set; }
        public int PendingPrescriptions { get; set; }
        public int PendingLabResults { get; set; }
        public List<RecentAppointmentDto> TodaySchedule { get; set; } = [];
    }

    // Patient dashboard
    public class PatientDashboardDto
    {
        public int UpcomingAppointments { get; set; }
        public int ActivePrescriptions { get; set; }
        public int UnreadMessages { get; set; }
        public int UnreadNotifications { get; set; }
        public RecentAppointmentDto? NextAppointment { get; set; }
    }

    public class RecentAppointmentDto
    {
        public Guid Id { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string DoctorSpecialization { get; set; } = string.Empty;
        public DateTime ScheduledAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}
