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

}

