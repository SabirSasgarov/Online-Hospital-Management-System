namespace HMS.API.Services
{
	public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
	{
		private readonly ClaimsPrincipal? _user = httpContextAccessor.HttpContext?.User;

		public string? UserId => _user?.FindFirstValue(ClaimTypes.NameIdentifier)
							   ?? _user?.FindFirstValue("sub");

		public string? UserName => _user?.FindFirstValue(ClaimTypes.Name);

		public string? Role => _user?.FindFirstValue(ClaimTypes.Role);

		public string? IpAddress => httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();

		public bool IsAuthenticated => _user?.Identity?.IsAuthenticated ?? false;
	}

}
