namespace HMS.Application.Auth.AuthDTOs
{

	public class RegisterDto
	{
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string UserName { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}

	public class LoginDto
	{
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}

	public class ConfirmEmailDto
	{
		public string Email { get; set; } = string.Empty;
		public string Code { get; set; } = string.Empty;
	}

	public class ResendConfirmationDto
	{
		public string Email { get; set; } = string.Empty;
	}

	public class GoogleSignInDto
	{
		public string IdToken { get; set; } = string.Empty;
	}

	public class ForgotPasswordDto
	{
		public string Email { get; set; } = string.Empty;
	}

	public class ResetPasswordDto
	{
		public string Email { get; set; } = string.Empty;
		public string Code { get; set; } = string.Empty;
		public string NewPassword { get; set; } = string.Empty;
	}

	public class ChangePasswordDto
	{
		public string CurrentPassword { get; set; } = string.Empty;
		public string NewPassword { get; set; } = string.Empty;
	}

	public class AuthResponseDto
	{
		public string AccessToken { get; set; } = string.Empty;
		public string RefreshToken { get; set; } = string.Empty;
		public DateTime AccessTokenExpiry { get; set; }
		public string UserId { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string FullName { get; set; } = string.Empty;
		public IList<string> Roles { get; set; } = [];
	}

	public class RefreshTokenDto
	{
		public string AccessToken { get; set; } = string.Empty;
		public string RefreshToken { get; set; } = string.Empty;
	}

	public class AssignRoleDto
	{
		public string UserId { get; set; } = string.Empty;
		public string RoleName { get; set; } = string.Empty;
	}

	public class UserDto
	{
		public string Id { get; set; } = string.Empty;
		public string FullName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string UserName { get; set; } = string.Empty;
		public bool IsActive { get; set; }
		public IList<string> Roles { get; set; } = [];
	}

	public class ProfileDto
	{
		public string Id { get; set; } = string.Empty;
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string? PhoneNumber { get; set; }
		public string? ProfileImageUrl { get; set; }
		public bool EmailConfirmed { get; set; }
		public IList<string> Roles { get; set; } = [];
	}

	public class UpdateProfileDto
	{
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string? PhoneNumber { get; set; }
		public string? ProfileImageUrl { get; set; }
	}

	public class ChangeEmailRequestDto
	{
		public string NewEmail { get; set; } = string.Empty;
		public string CurrentPassword { get; set; } = string.Empty;
	}

	public class ConfirmEmailChangeDto
	{
		public string Code { get; set; } = string.Empty;
	}

	/// <summary>
	/// Admin-only: creates a Nurse or Admin login. Doctor accounts are created through
	/// POST /api/doctor instead, since that flow also creates the Doctor clinical profile.
	/// </summary>
	public class CreateStaffUserDto
	{
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
		/// <summary>Must be "Nurse" or "Admin".</summary>
		public string Role { get; set; } = string.Empty;
		public string? ProfileImageUrl { get; set; }
	}

	public class StaffUserDto
	{
		public string Id { get; set; } = string.Empty;
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string? ProfileImageUrl { get; set; }
		public bool IsActive { get; set; }
		public bool EmailConfirmed { get; set; }
		public IList<string> Roles { get; set; } = [];
	}

}

