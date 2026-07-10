using HMS.Application.Auth.AuthDTOs;
using HMS.Application.Models;
using HMS.Domain.Constants;
using HMS.Domain.Entities;
using HMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace HMS.API.Controllers
{
	[EnableRateLimiting("auth")]
	public class AuthController(
		UserManager<AppUser> userManager,
		SignInManager<AppUser> signInManager,
		RoleManager<AppRole> roleManager,
		IJwtService jwtService,
		IEmailService emailService,
		GoogleTokenValidator googleTokenValidator,
		IConfiguration configuration) : BaseApiController
		{
		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var user = new AppUser
			{
				UserName = registerDto.Email,
				Email = registerDto.Email,
				FirstName = registerDto.FirstName,
				LastName = registerDto.LastName,
				EmailConfirmed = true
			};
			var result = await userManager.CreateAsync(user, registerDto.Password);
			if (!result.Succeeded)
			{
				foreach (var error in result.Errors)
				{
					ModelState.AddModelError(error.Code, error.Description);
				}
				return BadRequest(ModelState);
			}
			await userManager.AddToRoleAsync(user, Roles.Patient);
			_ = emailService.SendWelcomeEmailAsync(user.Email!, $"{user.FirstName} {user.LastName}");
			return Ok(new { Message = "User registered successfully" });
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto dto)
		{
			var user = await userManager.FindByEmailAsync(dto.Email);
			if (user is null || !user.IsActive)
				return Unauthorized(Result.Failure("Invalid credentials."));

			var result = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
			if (!result.Succeeded)
				return Unauthorized(Result.Failure("Invalid credentials."));

			return Ok(Result<AuthResponseDto>.Success(await BuildAuthResponse(user)));
		}












		[HttpPost("refresh-token")]
		public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
		{
			//async must be added
			var user = userManager.Users
				.FirstOrDefault(u => u.RefreshToken == dto.RefreshToken);

			if (user is null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
				return Unauthorized(Result.Failure("Invalid or expired refresh token."));

			return Ok(Result<AuthResponseDto>.Success(await BuildAuthResponse(user)));
		}

		[Authorize]
		[HttpPost("revoke-token")]
		public async Task<IActionResult> RevokeToken()
		{
			var user = await userManager.GetUserAsync(User);
			if (user is null) return Unauthorized(Result.Failure("User session is invalid."));

			user.RefreshToken = null;
			user.RefreshTokenExpiryTime = null;
			await userManager.UpdateAsync(user);
			return Ok(Result.Success("Token revoked."));
		}

		private async Task<AuthResponseDto> BuildAuthResponse(AppUser user)
		{
			var roles = await userManager.GetRolesAsync(user);
			var permissions = new List<string>();
			foreach (var roleName in roles)
			{
				var role = await roleManager.FindByNameAsync(roleName);
				if (role is not null)
				{
					var claims = await roleManager.GetClaimsAsync(role);
					permissions.AddRange(claims.Where(c => c.Type == "permission").Select(c => c.Value));
				}
			}

			var jwtSettings = configuration.GetSection("JwtSettings");
			var expiryMinutes = jwtSettings.GetValue<int>("AccessTokenExpirationMinutes", 60);

			var accessToken = jwtService.GenerateAccessToken(user, roles, [.. permissions.Distinct()]);
			var refreshToken = jwtService.GenerateRefreshToken();

			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
				configuration.GetValue<int>("JwtSettings:RefreshTokenExpirationDays", 7));
			await userManager.UpdateAsync(user);

			return new AuthResponseDto
			{
				AccessToken = accessToken,
				RefreshToken = refreshToken,
				AccessTokenExpiry = DateTime.UtcNow.AddMinutes(expiryMinutes),
				UserId = user.Id.ToString(),
				Email = user.Email ?? string.Empty,
				FullName = $"{user.FirstName} {user.LastName}",
				Roles = roles
			};
		}
	}
}
