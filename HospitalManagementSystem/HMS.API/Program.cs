var builder = WebApplication.CreateBuilder(args);

// Application logs (errors, request traces, etc.) are written to the console for local dev
// and to the same Azure Storage account used for uploaded images, in a separate "logs" container,
// so they survive restarts/redeploys and are centralized across instances. This is distinct from
// the AuditLog table (who-did-what business audit trail), which already persists to Postgres.
builder.Host.UseSerilog((context, services, loggerConfig) =>
{
	var blobConnectionString = context.Configuration["AzureBlobStorage:ConnectionString"];
	var logsContainerName = context.Configuration["AzureBlobStorage:LogsContainerName"] ?? "careflowlogs";

	loggerConfig
		.MinimumLevel.Information()
		.MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
		.MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
		.Enrich.FromLogContext()
		.WriteTo.Console();

	if (!string.IsNullOrWhiteSpace(blobConnectionString))
	{
		loggerConfig.WriteTo.AzureBlobStorage(
			connectionString: blobConnectionString,
			restrictedToMinimumLevel: LogEventLevel.Information,
			storageContainerName: logsContainerName,
			storageFileName: "logs/log-{yyyy}-{MM}-{dd}.txt",
			period: TimeSpan.FromSeconds(15),
			batchPostingLimit: 100);
	}
});

// Add services to the container.

builder.Services.AddControllers();


// Restricted to known frontend origins (configured in appsettings under Cors:AllowedOrigins)
// instead of AllowAnyOrigin — the API only needs to be callable from the CareFlow frontend(s).
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policy =>
	{
		if (allowedOrigins.Length > 0)
		{
			policy.WithOrigins(allowedOrigins)
				  .AllowAnyMethod()
				  .AllowAnyHeader();
		}
		else
		{
			// Fallback so a missing config section doesn't lock everyone out — but this should
			// always be set explicitly via Cors:AllowedOrigins in appsettings for real deployments.
			policy.WithOrigins("http://localhost:5173", "http://localhost:5000")
				  .AllowAnyMethod()
				  .AllowAnyHeader();
		}
	});
});

builder.Services
	.AddApplication()
	.AddInfrastructure(builder.Configuration)
	.AddPersistence(builder.Configuration)
	.AddPresentation(builder.Configuration);

// Automatically emails patients ~1 day before their appointment (also triggerable on demand by
// nurses/admins via POST /api/notification/run-appointment-reminders).
builder.Services.AddHostedService<AppointmentReminderBackgroundService>();

var app = builder.Build();

// Configure the HTTP request pipeline

app.UseSerilogRequestLogging();

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

app.UseExceptionHandler();
app.UseCors();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

try
{
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
		await OfferSeeds.SeedAsync(sp);          // 6. Default "What CareFlow Offers" home page cards
	}

	app.Run();
}
catch (Exception ex)
{
	Log.Fatal(ex, "CareFlow API terminated unexpectedly");
	throw;
}
finally
{
	Log.CloseAndFlush();
}
