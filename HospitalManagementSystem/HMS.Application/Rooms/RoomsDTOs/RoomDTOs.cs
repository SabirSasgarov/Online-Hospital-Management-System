namespace HMS.Application.Rooms.RoomsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    public class RoomSummaryDto
    {
        public Guid Id { get; set; }
        public Guid WardId { get; set; }
        public string WardName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int TotalBeds { get; set; }
        public int OccupiedBeds { get; set; }
        public int AvailableBeds => TotalBeds - OccupiedBeds;
        public DateTime CreatedAt { get; set; }
    }

    public class RoomDto : RoomSummaryDto
    {
        public List<BedInRoomDto> Beds { get; set; } = [];
    }

    public class BedInRoomDto
    {
        public Guid Id { get; set; }
        public string BedNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public Guid? PatientId { get; set; }
        public string? PatientName { get; set; }
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    public class CreateRoomDto
    {
        public Guid WardId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public RoomType Type { get; set; }
    }

    public class UpdateRoomDto
    {
        public string RoomNumber { get; set; } = string.Empty;
        public RoomType Type { get; set; }
    }
}
