namespace HMS.Application.Doctors.DoctorsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    public class DoctorScheduleDto
    {
        public Guid Id { get; set; }
        public string Day { get; set; } = string.Empty; 
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }

    public class DoctorSummaryDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsActive { get; set; }
        public List<string> ScheduleDays { get; set; } = [];
        public DateTime CreatedAt { get; set; }
    }

    public class DoctorDto : DoctorSummaryDto
    {
        public List<DoctorScheduleDto> Schedules { get; set; } = [];
        public int TotalAppointments { get; set; }
        public int ActiveVisits { get; set; }
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    public class CreateDoctorDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public List<CreateDoctorScheduleDto> Schedules { get; set; } = [];
    }

    public class CreateDoctorScheduleDto
    {
        public DayOfWeek Day { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }

    public class UpdateDoctorDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
    }

    public class UpdateDoctorScheduleDto
    {
        public List<CreateDoctorScheduleDto> Schedules { get; set; } = [];
    }

    public class UpdateDoctorAvailabilityDto
    {
        public bool IsAvailable { get; set; }
    }
}
