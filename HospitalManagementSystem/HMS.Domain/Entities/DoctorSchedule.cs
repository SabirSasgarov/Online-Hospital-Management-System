using HMS.Domain.Common;

namespace HMS.Domain.Entities
{
    public class DoctorSchedule : BaseEntity
    {
        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        // 0 = Sunday ... 6 = Saturday  (maps to System.DayOfWeek)
        public DayOfWeek Day { get; set; }

        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
