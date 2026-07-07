namespace HMS.Application.Common.Interfaces
{
	public interface IJwtService
	{
		string GenerateAccessToken(AppUser user, IList<string> roles, IList<string> permissions);
		string GenerateRefreshToken();
	}
}
