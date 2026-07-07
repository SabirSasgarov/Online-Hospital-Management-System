namespace HMS.Infrastructure
{
	public static class DependencyInjection
	{
		public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
		{
			services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
			services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));
			services.Configure<GoogleAuthSettings>(configuration.GetSection("GoogleAuthSettings"));

			services.AddScoped<IJwtService, JwtService>();
			services.AddScoped<IEmailService, EmailService>();
			services.AddScoped<GoogleTokenValidator>();

			return services;
		}
	}
}
