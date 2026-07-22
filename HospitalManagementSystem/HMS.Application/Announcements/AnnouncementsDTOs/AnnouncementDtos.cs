namespace HMS.Application.Announcements.AnnouncementsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    public class AnnouncementDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
        public string Author { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    public class CreateAnnouncementDto
    {
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsPublished { get; set; }
    }

    public class UpdateAnnouncementDto
    {
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsPublished { get; set; }
    }
}
