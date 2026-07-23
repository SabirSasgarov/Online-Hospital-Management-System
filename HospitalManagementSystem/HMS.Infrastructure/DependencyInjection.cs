namespace HMS.Infrastructure
{
	public static class DependencyInjection
	{
		public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
		{
			services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
			services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));
			services.Configure<GoogleAuthSettings>(configuration.GetSection("GoogleAuthSettings"));
			services.Configure<AzureBlobSettings>(configuration.GetSection("AzureBlobStorage"));

			services.AddScoped<IJwtService, JwtService>();
			services.AddScoped<IEmailService, EmailService>();
			services.AddScoped<GoogleTokenValidator>();
			// Singleton: BlobServiceClient/BlobContainerClient are thread-safe and meant to be reused —
			// registering this as Scoped meant every request re-created the client and re-checked the
			// container's existence with an Azure API call.
			services.AddSingleton<IBlobStorageService, AzureBlobService>();

			return services;
		}
	}
}
