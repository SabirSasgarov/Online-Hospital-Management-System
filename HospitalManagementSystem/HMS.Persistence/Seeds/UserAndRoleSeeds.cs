using System.Security.Claims;

namespace HMS.Persistence.Seeds
{
	public static class UserAndRoleSeeds
	{
		private const string PermissionClaimType = "permission";

		public static async Task SeedAsync(IServiceProvider services)
		{
			var logger = services.GetRequiredService<ILogger<AppDomain>>();

			try
			{
				var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
				var userManager = services.GetRequiredService<UserManager<AppUser>>();

				string[] roleNames = [Roles.Admin, Roles.Doctor, Roles.Nurse, Roles.Patient];

				foreach (var roleName in roleNames)
				{
					if (!await roleManager.RoleExistsAsync(roleName))
						await roleManager.CreateAsync(new AppRole { Name = roleName });
				}

				await AddPermissionsToRoleAsync(roleManager, Roles.Admin, Permissions.All());

				await AddPermissionsToRoleAsync(roleManager, Roles.Doctor,
				[
				Permissions.Dashboard.ViewDoctor,

				Permissions.Patients.View,
				Permissions.Patients.Search,
				Permissions.Patients.ViewMedicalHistory,

				Permissions.Doctors.View,
				Permissions.Doctors.ViewAvailability,

				Permissions.Appointments.View,
				Permissions.Appointments.Create,
				Permissions.Appointments.Edit,
				Permissions.Appointments.Cancel,
				Permissions.Appointments.Complete,
				Permissions.Appointments.CheckConflict,

				Permissions.Visits.View,
				Permissions.Visits.Edit,

				Permissions.Prescriptions.View,
				Permissions.Prescriptions.Create,
				Permissions.Prescriptions.Edit,
				Permissions.Prescriptions.ChangeStatus,

				Permissions.LabResults.View,
				Permissions.LabResults.Create,
				Permissions.LabResults.Edit,

				Permissions.DischargeSummaries.View,
				Permissions.DischargeSummaries.Create,
				Permissions.DischargeSummaries.DownloadPdf,

				Permissions.Messages.View,
				Permissions.Messages.Send,
				Permissions.Messages.MarkAsRead,

				Permissions.Notifications.View,
				Permissions.Notifications.MarkAsRead,
				Permissions.Notifications.ManagePreferences
				]);

				await AddPermissionsToRoleAsync(roleManager, Roles.Nurse,
				[
				Permissions.Dashboard.ViewNurse,

				Permissions.Patients.View,
				Permissions.Patients.Search,
				Permissions.Patients.ViewMedicalHistory,

				Permissions.Appointments.View,
				Permissions.Appointments.Edit,
				Permissions.Appointments.Cancel,

				Permissions.Wards.View,
				Permissions.Rooms.View,
				Permissions.Beds.View,
				Permissions.Beds.EditStatus,
				Permissions.Beds.AssignPatient,
				Permissions.Beds.Release,

				Permissions.Visits.View,
				Permissions.Visits.Admit,
				Permissions.Visits.Edit,

				Permissions.LabResults.View,
				Permissions.LabResults.Create,
				Permissions.LabResults.Edit,

				Permissions.Notifications.View,
				Permissions.Notifications.MarkAsRead
				]);

				await AddPermissionsToRoleAsync(roleManager, Roles.Patient,
				[
				Permissions.Dashboard.ViewPatient,

				Permissions.Patients.View,
				Permissions.Patients.ViewMedicalHistory,

				Permissions.Doctors.View,
				Permissions.Doctors.ViewAvailability,

				Permissions.Appointments.View,
				Permissions.Appointments.Create,
				Permissions.Appointments.Cancel,
				Permissions.Appointments.CheckConflict,

				Permissions.Prescriptions.View,
				Permissions.LabResults.View,
				Permissions.DischargeSummaries.View,
				Permissions.DischargeSummaries.DownloadPdf,

				Permissions.Messages.View,
				Permissions.Messages.Send,
				Permissions.Messages.MarkAsRead,

				Permissions.Notifications.View,
				Permissions.Notifications.MarkAsRead,
				Permissions.Notifications.ManagePreferences
				]);

				const string adminEmail = "admin@hms.com";
				const string doctorEmail = "doctor@hms.com";
				const string nurseEmail = "nurse@hms.com";
				const string patientEmail = "patient@hms.com";
				var adminUser = await userManager.FindByEmailAsync(adminEmail);
				var doctorUser = await userManager.FindByEmailAsync(doctorEmail);
				var nurseUser = await userManager.FindByEmailAsync(nurseEmail);
				var patientUser = await userManager.FindByEmailAsync(patientEmail);

				if (adminUser is null)
				{
					adminUser = new AppUser
					{
						FirstName = "System",
						LastName = "Admin",
						Email = adminEmail,
						UserName = "admin",
						EmailConfirmed = true,
						IsActive = true
					};

					await userManager.CreateAsync(adminUser, "Admin123!");
					await userManager.AddToRoleAsync(adminUser, Roles.Admin);
				}
				else
				{
					if (!adminUser.IsActive)
					{
						adminUser.IsActive = true;
						await userManager.UpdateAsync(adminUser);
					}

					if (!await userManager.IsInRoleAsync(adminUser, Roles.Admin))
						await userManager.AddToRoleAsync(adminUser, Roles.Admin);
				}

				if (doctorUser is null)
				{
					doctorUser = new AppUser
					{
						FirstName = "System",
						LastName = "Doctor",
						Email = doctorEmail,
						UserName = "doctor",
						EmailConfirmed = true,
						IsActive = true
					};

					await userManager.CreateAsync(doctorUser, "Doctor123!");
					await userManager.AddToRoleAsync(doctorUser, Roles.Doctor);
				}
				else
				{
					if (!doctorUser.IsActive)
					{
						doctorUser.IsActive = true;
						await userManager.UpdateAsync(doctorUser);
					}

					if (!await userManager.IsInRoleAsync(doctorUser, Roles.Doctor))
						await userManager.AddToRoleAsync(doctorUser, Roles.Doctor);
				}


				if (nurseUser is null)
				{
					nurseUser = new AppUser
					{
						FirstName = "System",
						LastName = "Nurse",
						Email = nurseEmail,
						UserName = "nurse",
						EmailConfirmed = true,
						IsActive = true
					};

					await userManager.CreateAsync(nurseUser, "Nurse123!");
					await userManager.AddToRoleAsync(nurseUser, Roles.Nurse);
				}
				else
				{
					if (!nurseUser.IsActive)
					{
						nurseUser.IsActive = true;
						await userManager.UpdateAsync(nurseUser);
					}

					if (!await userManager.IsInRoleAsync(nurseUser, Roles.Nurse))
						await userManager.AddToRoleAsync(nurseUser, Roles.Nurse);
				}


				if (patientUser is null)
				{
					patientUser = new AppUser
					{
						FirstName = "System",
						LastName = "Patient",
						Email = patientEmail,
						UserName = "patient",
						EmailConfirmed = true,
						IsActive = true
					};

					await userManager.CreateAsync(patientUser, "Patient123!");
					await userManager.AddToRoleAsync(patientUser, Roles.Patient);
				}
				else
				{
					if (!patientUser.IsActive)
					{
						patientUser.IsActive = true;
						await userManager.UpdateAsync(patientUser);
					}

					if (!await userManager.IsInRoleAsync(patientUser, Roles.Patient))
						await userManager.AddToRoleAsync(patientUser, Roles.Patient);
				}
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "An error occurred while seeding the database.");
				throw;
			}
		}

		private static async Task AddPermissionsToRoleAsync(
			RoleManager<AppRole> roleManager,
			string roleName,
			IEnumerable<string> permissions)
		{
			var role = await roleManager.FindByNameAsync(roleName);

			if (role is null)
				return;

			var existingClaims = await roleManager.GetClaimsAsync(role);

			foreach (var permission in permissions.Distinct())
			{
				if (!existingClaims.Any(c => c.Type == PermissionClaimType && c.Value == permission))
				{
					await roleManager.AddClaimAsync(
						role,
						new Claim(PermissionClaimType, permission));
				}
			}
		}

	}
}
