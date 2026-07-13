using HMS.API;
using HMS.Application;
using HMS.Infrastructure;
using HMS.Persistence;
using HMS.Persistence.Seeds;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policy =>
	{
		policy.AllowAnyOrigin()
			  .AllowAnyMethod()
			  .AllowAnyHeader();
	});
});

builder.Services
	.AddApplication()
	.AddInfrastructure(builder.Configuration)
	.AddPersistence(builder.Configuration)
	.AddPresentation(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline

app.UseSwagger();
app.UseSwaggerUI(c =>
{
	c.SwaggerEndpoint("/swagger/v1/swagger.json", "HMS API v1");
	c.RoutePrefix = "swagger";
	c.DisplayRequestDuration();
	c.EnableDeepLinking();
});

if (!app.Environment.IsProduction())
	app.UseHttpsRedirection();

app.UseCors();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await HMS.Persistence.DependencyInjection.ApplyMigrationsAsync(app.Services);
using (var scope = app.Services.CreateScope())
{
	var sp = scope.ServiceProvider;
	// with oredered seeding to avoid foreign key constraint issues
	await UserAndRoleSeeds.SeedAsync(sp);    // 1. Roles + base users (admin, nurse)
	await DoctorSeeds.SeedAsync(sp);         // 2. Doctor users + Doctor profiles + schedules
	await PatientSeeds.SeedAsync(sp);        // 3. Patient users + Patient profiles
	await WardSeeds.SeedAsync(sp);           // 4. Wards → Rooms → Beds
	await ClinicalDataSeeds.SeedAsync(sp);   // 5. Appointments, Visits, Prescriptions, Labs, Messages
}

app.Run();
