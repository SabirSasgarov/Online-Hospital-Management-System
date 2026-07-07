using HMS.Domain.Entities;
using HMS.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HMS.Persistence
{
	public static class DependencyInjection
	{
		public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddDbContext<AppDbContext>(options =>
			{
				options.UseNpgsql(
					configuration.GetConnectionString("DefaultConnection"),
					npgsql =>
					{
						npgsql.EnableRetryOnFailure(
							maxRetryCount: 5,
							maxRetryDelay: TimeSpan.FromSeconds(10),
							errorCodesToAdd: null);
						npgsql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName);
					});
			});

			services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());
			services.AddIdentity<AppUser, AppRole>(options =>
			{
				options.Password.RequiredLength = 8;
				options.Password.RequireNonAlphanumeric = true;
				options.Password.RequireUppercase = true;
				options.Password.RequireDigit = true;
				options.User.RequireUniqueEmail = true;
				options.SignIn.RequireConfirmedEmail = false;
			})
			.AddEntityFrameworkStores<AppDbContext>()
			.AddDefaultTokenProviders();

			return services;
		}

		/// <summary>
		/// Applies pending EF migrations and seeds data. Call this from Program.cs at startup.
		/// </summary>
		public static async Task ApplyMigrationsAsync(IServiceProvider services)
		{
			using var scope = services.CreateScope();
			var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
			await db.Database.MigrateAsync();
		}
	}
}
