using HMS.Domain.Common;

namespace HMS.Domain.Entities
{
    public class AuditLog : BaseEntity
    {
        // Stored as strings so logs survive even if the user is deleted
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty;

        public string Action { get; set; } = string.Empty;

        // Entity type name, "Patient", "Prescription"
        public string Resource { get; set; } = string.Empty;
        public string ResourceId { get; set; } = string.Empty;

        public string IpAddress { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
