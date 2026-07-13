using HMS.Domain.Common;
using HMS.Domain.Enums;

namespace HMS.Domain.Entities
{
    public class Notification : BaseEntity
    {
        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Optional deep-link: the ID of the related resource (appointment, prescription, etc.)
        public Guid? RelatedEntityId { get; set; }
    }
}
