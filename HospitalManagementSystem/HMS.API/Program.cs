using HMS.API;

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

builder.Services.AddPresentation(builder.Configuration);

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

app.Run();
