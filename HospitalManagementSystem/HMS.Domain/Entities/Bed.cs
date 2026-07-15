namespace HMS.Domain.Entities
{
    public class Bed : AuditableEntity
    {
        public Guid RoomId { get; set; }
        public Room Room { get; set; } = null!;

        public string BedNumber { get; set; } = string.Empty;   // e.g. "301A"
        public BedStatus Status { get; set; } = BedStatus.Available;

        // Nullable — only set when Status == Occupied
        public Guid? PatientId { get; set; }
        public Patient? Patient { get; set; }
    }
}
