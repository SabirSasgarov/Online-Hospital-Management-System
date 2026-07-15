namespace HMS.Application.Doctors.DoctorsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    public class DoctorScheduleDto
    {
        public Guid Id { get; set; }
        public string Day { get; set; } = string.Empty;      // "Monday"
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }

    /// <summary>Compact row for list/search results.</summary>
    public class DoctorSummaryDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public bool IsActive { get; set; }
        public List<string> ScheduleDays { get; set; } = [];
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>Full profile returned by GET /doctor/{id}.</summary>
    public class DoctorDto : DoctorSummaryDto
    {
        public List<DoctorScheduleDto> Schedules { get; set; } = [];
        public int TotalAppointments { get; set; }
        public int ActiveVisits { get; set; }
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    /// <summary>Admin creates a new doctor account + profile.</summary>
    public class CreateDoctorDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public List<CreateDoctorScheduleDto> Schedules { get; set; } = [];
    }

    public class CreateDoctorScheduleDto
    {
        public DayOfWeek Day { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }

    /// <summary>Admin/doctor updates basic info.</summary>
    public class UpdateDoctorDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
    }

    /// <summary>Replaces the full schedule for a doctor.</summary>
    public class UpdateDoctorScheduleDto
    {
        public List<CreateDoctorScheduleDto> Schedules { get; set; } = [];
    }

    /// <summary>Toggles availability flag.</summary>
    public class UpdateDoctorAvailabilityDto
    {
        public bool IsAvailable { get; set; }
    }
}
