using HMS.API.Authorization;
using HMS.API.Services;
using HMS.Domain.Constants;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;
using System.Threading.RateLimiting;

namespace HMS.API
{
	public static class DependencyInjection
	{
		private static readonly string[] configureOptions = ["Rate limit exceeded."];

		public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddHttpContextAccessor();
			services.AddScoped<ICurrentUserService, CurrentUserService>();

			services.AddControllers();

			// Global exception handling – returns clean JSON for ALL unhandled exceptions
			//services.AddExceptionHandler<GlobalExceptionHandler>();
			services.AddProblemDetails();
			// Rate Limiting – prevents DDoS and spam abuse
			services.AddRateLimiter(options =>
			{
				options.OnRejected = async (context, cancellationToken) =>
				{
					context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
					context.HttpContext.Response.ContentType = "application/json";

					var retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfterValue)
						? retryAfterValue.TotalSeconds
						: 60;

					context.HttpContext.Response.Headers.RetryAfter = retryAfter.ToString("F0");

					var response = new
					{
						succeeded = false,
						message = $"Too many requests. Please try again after {retryAfter:F0} seconds.",
						data = (object?)null,
						errors = configureOptions
					};
					await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken);
				};

				// Named policy: "fixed" – 60 requests per minute per IP
				options.AddPolicy("fixed", httpContext =>
					RateLimitPartition.GetFixedWindowLimiter(
						partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
						factory: _ => new FixedWindowRateLimiterOptions
						{
							PermitLimit = 60,
							Window = TimeSpan.FromMinutes(1),
							QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
							QueueLimit = 0
						}));

				// Named policy: "auth" – 20 requests per minute per IP
				options.AddPolicy("auth", httpContext =>
					RateLimitPartition.GetFixedWindowLimiter(
						partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
						factory: _ => new FixedWindowRateLimiterOptions
						{
							PermitLimit = 20,
							Window = TimeSpan.FromMinutes(1),
							QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
							QueueLimit = 0
						}));

				options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
					RateLimitPartition.GetFixedWindowLimiter(
						partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
						factory: _ => new FixedWindowRateLimiterOptions
						{
							PermitLimit = 60,
							Window = TimeSpan.FromMinutes(1),
							QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
							QueueLimit = 0
						}));
			});

			services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(options =>
			{
				var jwtSettings = configuration.GetSection("JwtSettings");
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = jwtSettings["Issuer"],
					ValidAudience = jwtSettings["Audience"],
					IssuerSigningKey = new SymmetricSecurityKey(
						Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
				};

				// Return standardized Result wrapper for auth failures
				options.Events = new JwtBearerEvents
				{
					OnChallenge = async context =>
					{
						context.HandleResponse();
						context.Response.StatusCode = StatusCodes.Status401Unauthorized;
						context.Response.ContentType = "application/json";
						var response = new { succeeded = false, message = "Authentication is required.", data = (object?)null, errors = configureOptions };
						await context.Response.WriteAsJsonAsync(response);
					},
					OnForbidden = async context =>
					{
						context.Response.StatusCode = StatusCodes.Status403Forbidden;
						context.Response.ContentType = "application/json";
						var response = new { succeeded = false, message = "You do not have permission to access this resource.", data = (object?)null, errors = configureOptions };
						await context.Response.WriteAsJsonAsync(response);
					}
				};
			})
			.AddGoogleAuthIfConfigured(configuration);


			// Register RBAC policy for every permission
			services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
			services.AddAuthorization(options =>
			{
				foreach (var permission in Permissions.All())
					options.AddPolicy(permission, policy =>
						policy.Requirements.Add(new PermissionRequirement(permission)));
			});

			services.AddSwaggerGen();

			return services;
		}

		private static AuthenticationBuilder AddGoogleAuthIfConfigured(
		this AuthenticationBuilder builder, IConfiguration configuration)
		{
			var clientId = configuration["GoogleAuthSettings:ClientId"];
			var clientSecret = configuration["GoogleAuthSettings:ClientSecret"];

			if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(clientSecret))
				return builder;

			return builder.AddGoogle(options =>
			{
				options.ClientId = clientId;
				options.ClientSecret = clientSecret;
			});
		}

	}
}
