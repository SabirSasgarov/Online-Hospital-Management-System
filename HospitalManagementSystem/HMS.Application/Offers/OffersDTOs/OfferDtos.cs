namespace HMS.Application.Offers.OffersDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    public class OfferDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    public class CreateOfferDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = "Sparkles";
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateOfferDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = "Sparkles";
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
