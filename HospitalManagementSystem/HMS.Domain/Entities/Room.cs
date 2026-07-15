namespace HMS.Domain.Entities
{
    public class Room : AuditableEntity
    {
        public Guid WardId { get; set; }
        public Ward Ward { get; set; } = null!;

        public string RoomNumber { get; set; } = string.Empty;
        public RoomType Type { get; set; }

        // Navigation
        public ICollection<Bed> Beds { get; set; } = [];
    }
}
