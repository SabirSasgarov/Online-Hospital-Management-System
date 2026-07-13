using HMS.Domain.Enums;
using HMS.Persistence.Context;

namespace HMS.Persistence.Seeds
{
    /// <summary>
    /// Seeds patient AppUsers + their Patient profile entities.
    /// patient@hms.com (already seeded by UserAndRoleSeeds) gets a Patient profile here too.
    /// </summary>
    public static class PatientSeeds
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var context = services.GetRequiredService<AppDbContext>();
            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var logger = services.GetRequiredService<ILogger<AppDomain>>();

            try
            {
                if (context.Patients.Any()) return;

                var patientData = new[]
                {
                    new
                    {
                        FirstName = "Emily",    LastName = "Johnson",   Email = "patient@hms.com",
                        UserName = "patient",   Password = "Patient123!",
                        DOB = new DateOnly(1985, 4, 12),  Gender = Gender.Female, BloodType = "A+",
                        Phone = "+1-555-0101",  Address = "123 Oak St, Springfield",
                        ECName = "James Johnson", ECPhone = "+1-555-0102",
                        Conditions = "Hypertension,Diabetes Type 2", Allergies = "Penicillin"
                    },
                    new
                    {
                        FirstName = "Michael",  LastName = "Chen",      Email = "michael.chen@hms.com",
                        UserName = "michael.chen", Password = "Patient123!",
                        DOB = new DateOnly(1990, 8, 23),  Gender = Gender.Male,   BloodType = "O-",
                        Phone = "+1-555-0103",  Address = "456 Maple Ave, Lincoln",
                        ECName = "Lisa Chen",   ECPhone = "+1-555-0104",
                        Conditions = "Asthma",  Allergies = ""
                    },
                    new
                    {
                        FirstName = "Sarah",    LastName = "Williams",  Email = "sarah.williams@hms.com",
                        UserName = "sarah.williams", Password = "Patient123!",
                        DOB = new DateOnly(1978, 11, 5),  Gender = Gender.Female, BloodType = "B+",
                        Phone = "+1-555-0105",  Address = "789 Pine Rd, Riverside",
                        ECName = "Tom Williams", ECPhone = "+1-555-0106",
                        Conditions = "Arthritis,Hypothyroidism", Allergies = "Sulfa drugs,Aspirin"
                    },
                    new
                    {
                        FirstName = "Robert",   LastName = "Garcia",    Email = "robert.garcia@hms.com",
                        UserName = "robert.garcia", Password = "Patient123!",
                        DOB = new DateOnly(1965, 2, 18),  Gender = Gender.Male,   BloodType = "AB+",
                        Phone = "+1-555-0107",  Address = "321 Cedar Ln, Lakewood",
                        ECName = "Maria Garcia", ECPhone = "+1-555-0108",
                        Conditions = "Coronary Artery Disease,Hypertension", Allergies = "Latex"
                    },
                    new
                    {
                        FirstName = "Jennifer", LastName = "Martinez",  Email = "jennifer.martinez@hms.com",
                        UserName = "jennifer.martinez", Password = "Patient123!",
                        DOB = new DateOnly(1995, 6, 30),  Gender = Gender.Female, BloodType = "A-",
                        Phone = "+1-555-0109",  Address = "654 Birch Blvd, Millbrook",
                        ECName = "Carlos Martinez", ECPhone = "+1-555-0110",
                        Conditions = "", Allergies = "NSAIDs"
                    },
                    new
                    {
                        FirstName = "David",    LastName = "Thompson",  Email = "david.thompson@hms.com",
                        UserName = "david.thompson", Password = "Patient123!",
                        DOB = new DateOnly(1958, 9, 14),  Gender = Gender.Male,   BloodType = "O+",
                        Phone = "+1-555-0111",  Address = "987 Elm St, Greenfield",
                        ECName = "Susan Thompson", ECPhone = "+1-555-0112",
                        Conditions = "COPD,Diabetes Type 2,Hypertension", Allergies = "Codeine"
                    },
                };

                foreach (var p in patientData)
                {
                    var user = await userManager.FindByEmailAsync(p.Email);
                    if (user is null)
                    {
                        user = new AppUser
                        {
                            FirstName = p.FirstName,
                            LastName = p.LastName,
                            Email = p.Email,
                            UserName = p.UserName,
                            EmailConfirmed = true,
                            IsActive = true
                        };
                        await userManager.CreateAsync(user, p.Password);
                        await userManager.AddToRoleAsync(user, Roles.Patient);
                    }

                    context.Patients.Add(new Patient
                    {
                        UserId = user.Id,
                        DateOfBirth = p.DOB,
                        Gender = p.Gender,
                        BloodType = p.BloodType,
                        Phone = p.Phone,
                        Address = p.Address,
                        EmergencyContactName = p.ECName,
                        EmergencyContactPhone = p.ECPhone,
                        Conditions = p.Conditions,
                        Allergies = p.Allergies,
                        CreatedBy = "system",
                        CreatedAt = DateTime.UtcNow
                    });
                }

                await context.SaveChangesAsync();
                logger.LogInformation("Patient profiles seeded.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error seeding patients.");
                throw;
            }
        }
    }
}
