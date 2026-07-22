namespace HMS.Domain.Entities
{
	/// <summary>
	/// A feature/offer card shown in the "What CareFlow Offers" section of the public home page,
	/// managed by admins from the CMS page in the admin portal.
	/// </summary>
	public class Offer : AuditableEntity
	{
		public string Title { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		/// <summary>Key into the frontend's lucide-react icon lookup map (e.g. "Stethoscope").</summary>
		public string Icon { get; set; } = "Sparkles";
		public int DisplayOrder { get; set; }
		public bool IsActive { get; set; } = true;
	}
}
