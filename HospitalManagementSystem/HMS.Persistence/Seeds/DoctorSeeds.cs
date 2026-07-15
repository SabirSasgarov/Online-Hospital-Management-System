namespace HMS.Persistence.Seeds
{
    /// <summary>
    /// Seeds additional doctor AppUsers + their Doctor profile entities.
    /// doctor@hms.com (already seeded by UserAndRoleSeeds) gets a Doctor profile here too.
    /// </summary>
    public static class DoctorSeeds
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var context = services.GetRequiredService<AppDbContext>();
            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var logger = services.GetRequiredService<ILogger<AppDomain>>();

            try
            {
                // ── 1. Ensure additional doctor users exist ────────────────────────────
                var doctorUsers = new[]
                {
                    new { FirstName = "James",  LastName = "Anderson", Email = "doctor@hms.com",          UserName = "doctor",          Spec = "Cardiology",      Phone = "+1-555-0201" },
                    new { FirstName = "Maria",  LastName = "Santos",   Email = "maria.santos@hms.com",    UserName = "maria.santos",    Spec = "Neurology",       Phone = "+1-555-0202" },
                    new { FirstName = "Kevin",  LastName = "Park",     Email = "kevin.park@hms.com",      UserName = "kevin.park",      Spec = "Orthopedics",     Phone = "+1-555-0203" },
                    new { FirstName = "Lisa",   LastName = "Brown",    Email = "lisa.brown@hms.com",      UserName = "lisa.brown",      Spec = "Pediatrics",      Phone = "+1-555-0204" },
                    new { FirstName = "Ahmed",  LastName = "Hassan",   Email = "ahmed.hassan@hms.com",    UserName = "ahmed.hassan",    Spec = "General Surgery", Phone = "+1-555-0205" },
                };

                foreach (var d in doctorUsers)
                {
                    var user = await userManager.FindByEmailAsync(d.Email);
                    if (user is null)
                    {
                        user = new AppUser
                        {
                            FirstName = d.FirstName,
                            LastName = d.LastName,
                            Email = d.Email,
                            UserName = d.UserName,
                            EmailConfirmed = true,
                            IsActive = true
                        };
                        await userManager.CreateAsync(user, "Doctor123!");
                        await userManager.AddToRoleAsync(user, Roles.Doctor);
                    }
                }

                await context.SaveChangesAsync();

                // ── 2. Create Doctor profile entities if they don't exist yet ─────────
                if (!context.Doctors.Any())
                {
                    var schedules = new Dictionary<string, DayOfWeek[]>
                    {
                        ["doctor@hms.com"]       = [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday],
                        ["maria.santos@hms.com"] = [DayOfWeek.Tuesday, DayOfWeek.Thursday],
                        ["kevin.park@hms.com"]   = [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday],
                        ["lisa.brown@hms.com"]   = [DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Thursday],
                        ["ahmed.hassan@hms.com"] = [DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Friday],
                    };

                    foreach (var d in doctorUsers)
                    {
                        var user = await userManager.FindByEmailAsync(d.Email);
                        if (user is null) continue;

                        var doctor = new Doctor
                        {
                            UserId = user.Id,
                            Specialization = d.Spec,
                            Phone = d.Phone,
                            IsAvailable = true,
                            CreatedBy = "system",
                            CreatedAt = DateTime.UtcNow
                        };

                        doctor.Schedules = schedules[d.Email].Select(day => new DoctorSchedule
                        {
                            Day = day,
                            StartTime = new TimeOnly(9, 0),
                            EndTime = day == DayOfWeek.Friday ? new TimeOnly(13, 0) : new TimeOnly(17, 0)
                        }).ToList();

                        context.Doctors.Add(doctor);
                    }

                    await context.SaveChangesAsync();
                    logger.LogInformation("Doctor profiles seeded.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error seeding doctors.");
                throw;
            }
        }
    }
}
