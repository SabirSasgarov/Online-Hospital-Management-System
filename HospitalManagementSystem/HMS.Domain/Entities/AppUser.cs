namespace HMS.Domain.Entities
{
	public class AppUser : IdentityUser<Guid>
	{
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string? ProfileImageUrl { get; set; }
		public bool IsActive { get; set; } = true;
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public string? RefreshToken { get; set; }
		public DateTime? RefreshTokenExpiryTime { get; set; }
		public string? PasswordResetCode { get; set; }
		public DateTime? PasswordResetCodeExpiry { get; set; }
	}
}
