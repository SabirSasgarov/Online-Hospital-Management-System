namespace HMS.API.Controllers
{
	/// <summary>
	/// Self-service endpoints for the currently logged-in user — name/phone, and an email change
	/// flow that requires confirming a code sent to the NEW address before it takes effect.
	/// Password changes reuse the existing POST /api/auth/change-password endpoint.
	/// </summary>
	[Authorize]
	public class ProfileController(
		UserManager<AppUser> userManager,
		IEmailService emailService) : BaseApiController
	{
		private static string GenerateCode() => Random.Shared.Next(100000, 999999).ToString();

		[HttpGet]
		public async Task<IActionResult> GetProfile()
		{
			var user = await userManager.GetUserAsync(User);
			if (user is null) return Unauthorized(Result.Failure("User session is invalid."));

			var roles = await userManager.GetRolesAsync(user);

			return Ok(new ProfileDto
			{
				Id = user.Id.ToString(),
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email ?? string.Empty,
				PhoneNumber = user.PhoneNumber,
				ProfileImageUrl = user.ProfileImageUrl,
				EmailConfirmed = user.EmailConfirmed,
				Roles = roles,
			});
		}

		[HttpPut]
		public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
		{
			var user = await userManager.GetUserAsync(User);
			if (user is null) return Unauthorized(Result.Failure("User session is invalid."));

			user.FirstName = dto.FirstName;
			user.LastName = dto.LastName;
			user.PhoneNumber = dto.PhoneNumber;
			user.ProfileImageUrl = dto.ProfileImageUrl;

			var result = await userManager.UpdateAsync(user);
			if (!result.Succeeded)
				return BadRequest(Result.Failure(result.Errors.Select(e => e.Description)));

			return Ok(Result.Success("Profile updated."));
		}

		[HttpPost("change-email")]
		public async Task<IActionResult> RequestEmailChange([FromBody] ChangeEmailRequestDto dto)
		{
			var user = await userManager.GetUserAsync(User);
			if (user is null) return Unauthorized(Result.Failure("User session is invalid."));

			var passwordOk = await userManager.CheckPasswordAsync(user, dto.CurrentPassword);
			if (!passwordOk)
				return BadRequest(Result.Failure("Current password is incorrect."));

			var existing = await userManager.FindByEmailAsync(dto.NewEmail);
			if (existing is not null && existing.Id != user.Id)
				return BadRequest(Result.Failure("That email address is already in use."));

			var code = GenerateCode();
			user.PendingEmail = dto.NewEmail;
			user.PendingEmailCode = code;
			user.PendingEmailCodeExpiry = DateTime.UtcNow.AddMinutes(15);
			await userManager.UpdateAsync(user);

			_ = emailService.SendEmailConfirmationCodeAsync(dto.NewEmail, $"{user.FirstName} {user.LastName}", code);
			return Ok(Result.Success("Confirmation code sent to your new email address."));
		}

		[HttpPost("confirm-email-change")]
		public async Task<IActionResult> ConfirmEmailChange([FromBody] ConfirmEmailChangeDto dto)
		{
			var user = await userManager.GetUserAsync(User);
			if (user is null) return Unauthorized(Result.Failure("User session is invalid."));

			if (string.IsNullOrEmpty(user.PendingEmail) ||
				user.PendingEmailCode is null ||
				user.PendingEmailCodeExpiry is null ||
				user.PendingEmailCode != dto.Code ||
				user.PendingEmailCodeExpiry < DateTime.UtcNow)
				return BadRequest(Result.Failure("Invalid or expired confirmation code."));

			user.Email = user.PendingEmail;
			user.UserName = user.PendingEmail;
			user.EmailConfirmed = true;
			user.PendingEmail = null;
			user.PendingEmailCode = null;
			user.PendingEmailCodeExpiry = null;

			var result = await userManager.UpdateAsync(user);
			if (!result.Succeeded)
				return BadRequest(Result.Failure(result.Errors.Select(e => e.Description)));

			return Ok(Result.Success("Email address updated."));
		}
	}
}
