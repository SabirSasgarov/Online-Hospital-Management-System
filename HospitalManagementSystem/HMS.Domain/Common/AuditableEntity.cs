namespace HMS.Domain.Common
{
	public class AuditableEntity : BaseEntity
	{
		public string CreatedBy { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; }
		public string? ModifiedBy { get; set; }
		public DateTime? ModifiedAt { get; set; }
		public bool IsDeleted { get; set; }
	}
}
