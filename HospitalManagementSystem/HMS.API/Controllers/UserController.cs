namespace HMS.API.Controllers
{
	/// <summary>
	/// Admin-only staff account management. Doctor accounts still go through POST /api/doctor
	/// (which also creates the clinical Doctor profile) — this controller only handles the
	/// Nurse and Admin logins that otherwise have no way to be created after initial seeding.
	/// </summary>
	[Authorize]
	public class UserController(UserManager<AppUser> userManager, IEmailService emailService) : BaseApiController
	{
		private static readonly string[] AllowedStaffRoles = [Roles.Nurse, Roles.Admin];

		// GET /api/user?role=Nurse
		// With no ?role filter, this is the "Staff Accounts" list — it deliberately excludes
		// Patients (they have their own dedicated Patients page/entity) and only returns
		// Nurse/Doctor/Admin logins.
		[HttpGet]
		[HasPermission(Permissions.Users.View)]
		public async Task<IActionResult> GetUsers([FromQuery] string? role)
		{
			var users = userManager.Users.ToList();
			var result = new List<StaffUserDto>();

			foreach (var user in users)
			{
				var roles = await userManager.GetRolesAsync(user);

				if (!string.IsNullOrWhiteSpace(role))
				{
					if (!roles.Contains(role, StringComparer.OrdinalIgnoreCase))
						continue;
				}
				else if (roles.Contains(Roles.Patient, StringComparer.OrdinalIgnoreCase) && roles.Count == 1)
				{
					continue; // patient-only accounts are excluded from the unfiltered staff list
				}

				result.Add(new StaffUserDto
				{
					Id = user.Id.ToString(),
					FirstName = user.FirstName,
					LastName = user.LastName,
					Email = user.Email ?? string.Empty,
					IsActive = user.IsActive,
					EmailConfirmed = user.EmailConfirmed,
					Roles = roles,
				});
			}

			return Ok(result);
		}

		// POST /api/user  (create a Nurse or Admin account)
		[HttpPost]
		[HasPermission(Permissions.Users.Create)]
		public async Task<IActionResult> CreateStaffUser([FromBody] CreateStaffUserDto dto)
		{
			if (!AllowedStaffRoles.Contains(dto.Role, StringComparer.OrdinalIgnoreCase))
				return BadRequest(Result.Failure($"Role must be one of: {string.Join(", ", AllowedStaffRoles)}."));

			if (await userManager.FindByEmailAsync(dto.Email) is not null)
				return BadRequest(Result.Failure($"A user with email '{dto.Email}' already exists."));

			var user = new AppUser
			{
				UserName = dto.Email,
				Email = dto.Email,
				FirstName = dto.FirstName,
				LastName = dto.LastName,
				EmailConfirmed = true, // admin-created staff accounts don't need self-confirmation
				IsActive = true,
			};

			var createResult = await userManager.CreateAsync(user, dto.Password);
			if (!createResult.Succeeded)
				return BadRequest(Result.Failure(createResult.Errors.Select(e => e.Description)));

			var matchedRole = AllowedStaffRoles.First(r => string.Equals(r, dto.Role, StringComparison.OrdinalIgnoreCase));
			await userManager.AddToRoleAsync(user, matchedRole);

			_ = emailService.SendAccountCreatedEmailAsync(user.Email!, $"{user.FirstName} {user.LastName}", dto.Password);

			return Ok(new StaffUserDto
			{
				Id = user.Id.ToString(),
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email ?? string.Empty,
				IsActive = user.IsActive,
				EmailConfirmed = user.EmailConfirmed,
				Roles = [matchedRole],
			});
		}

		// PATCH /api/user/{id}/active  (deactivate/reactivate a staff account)
		[HttpPatch("{id:guid}/active")]
		[HasPermission(Permissions.Users.Edit)]
		public async Task<IActionResult> SetActive(Guid id, [FromQuery] bool isActive)
		{
			var user = await userManager.FindByIdAsync(id.ToString());
			if (user is null) return NotFound(Result.Failure("User not found."));

			user.IsActive = isActive;
			await userManager.UpdateAsync(user);
			return Ok(Result.Success(isActive ? "Account reactivated." : "Account deactivated."));
		}
	}
}
