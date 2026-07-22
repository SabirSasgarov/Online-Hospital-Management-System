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

		// Email confirmation (self-registration only — Google sign-in and seeded/admin-created
		// accounts are considered confirmed immediately).
		public string? EmailConfirmationCode { get; set; }
		public DateTime? EmailConfirmationCodeExpiry { get; set; }

		// the new address isn't applied until the code sent to it is confirmed.
		public string? PendingEmail { get; set; }
		public string? PendingEmailCode { get; set; }
		public DateTime? PendingEmailCodeExpiry { get; set; }
	}
}
