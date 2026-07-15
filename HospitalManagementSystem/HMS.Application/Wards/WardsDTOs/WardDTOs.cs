namespace HMS.Application.Wards.WardsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    public class WardSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Floor { get; set; }
        public int TotalRooms { get; set; }
        public int TotalBeds { get; set; }
        public int OccupiedBeds { get; set; }
        public int AvailableBeds => TotalBeds - OccupiedBeds;
        public DateTime CreatedAt { get; set; }
    }

    public class WardDto : WardSummaryDto
    {
        public List<RoomSummaryInWardDto> Rooms { get; set; } = [];
    }

    public class RoomSummaryInWardDto
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int TotalBeds { get; set; }
        public int OccupiedBeds { get; set; }
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    public class CreateWardDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Floor { get; set; }
    }

    public class UpdateWardDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Floor { get; set; }
    }
}
