
namespace HMS.Domain.Entities
{
	public class AppRole : IdentityRole<Guid>
	{
		public string? Description { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}
