namespace HMS.Domain.Entities
{
    /// <summary>
    /// A public news/blog item shown on the marketing home page's "Announcements" feed,
    /// authored and managed by admins from the CMS page in the admin portal.
    /// </summary>
    public class Announcement : AuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}
