using Microsoft.Extensions.DependencyInjection;

namespace HMS.Application
{
	public static class DependencyInjection
	{
		public static IServiceCollection AddApplication(this IServiceCollection services)
		{
		//	var assembly = Assembly.GetExecutingAssembly();

		//	services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
		//	services.AddAutoMapper(assembly);

		//	// Auto-discover and register all AbstractValidator<T> implementations
		//	services.AddValidatorsFromAssembly(assembly);

		//	// Wire the validation pipeline: every MediatR request goes through validation first
		//	services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

			return services;
		}
	}
}
