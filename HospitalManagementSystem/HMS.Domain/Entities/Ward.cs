namespace HMS.Domain.Entities
{
    public class Ward : AuditableEntity
    {
        public string Name { get; set; } = string.Empty;

        // Free-text specialty label: "Cardiology", "General", "Intensive Care", etc.
        public string Type { get; set; } = string.Empty;

        public int Floor { get; set; }

        // Navigation
        public ICollection<Room> Rooms { get; set; } = [];

        // Computed helper — not stored, calculated from Rooms -> Beds
        public int TotalBeds => Rooms.SelectMany(r => r.Beds).Count();
        public int OccupiedBeds => Rooms.SelectMany(r => r.Beds)
                                        .Count(b => b.Status == Enums.BedStatus.Occupied);
    }
}
