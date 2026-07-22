namespace HMS.Domain.Constants
{
	public static class Permissions
	{
		public static class Users
		{
			public const string View = "Permissions.Users.View";
			public const string Create = "Permissions.Users.Create";
			public const string Edit = "Permissions.Users.Edit";
			public const string Delete = "Permissions.Users.Delete";
		}

		public static class Roles
		{
			public const string View = "Permissions.Roles.View";
			public const string Manage = "Permissions.Roles.Manage";
		}

		public static class Patients
		{
			public const string View = "Permissions.Patients.View";
			public const string Create = "Permissions.Patients.Create";
			public const string Edit = "Permissions.Patients.Edit";
			public const string Delete = "Permissions.Patients.Delete";
			public const string Search = "Permissions.Patients.Search";
			public const string ViewMedicalHistory = "Permissions.Patients.ViewMedicalHistory";
			public const string ManageMedicalHistory = "Permissions.Patients.ManageMedicalHistory";
		}

		public static class Doctors
		{
			public const string View = "Permissions.Doctors.View";
			public const string Search = "Permissions.Doctors.Search";
			public const string Create = "Permissions.Doctors.Create";
			public const string Edit = "Permissions.Doctors.Edit";
			public const string Delete = "Permissions.Doctors.Delete";
			public const string ManageSchedule = "Permissions.Doctors.ManageSchedule";
			public const string ViewAvailability = "Permissions.Doctors.ViewAvailability";
			public const string ManageAvailability = "Permissions.Doctors.ManageAvailability";
		}

		public static class Appointments
		{
			public const string View = "Permissions.Appointments.View";
			public const string Create = "Permissions.Appointments.Create";
			public const string Edit = "Permissions.Appointments.Edit";
			public const string Cancel = "Permissions.Appointments.Cancel";
			public const string Complete = "Permissions.Appointments.Complete";
			public const string CheckConflict = "Permissions.Appointments.CheckConflict";
		}

		public static class Wards
		{
			public const string View = "Permissions.Wards.View";
			public const string Create = "Permissions.Wards.Create";
			public const string Edit = "Permissions.Wards.Edit";
			public const string Delete = "Permissions.Wards.Delete";
		}

		public static class Rooms
		{
			public const string View = "Permissions.Rooms.View";
			public const string Create = "Permissions.Rooms.Create";
			public const string Edit = "Permissions.Rooms.Edit";
			public const string Delete = "Permissions.Rooms.Delete";
		}

		public static class Beds
		{
			public const string View = "Permissions.Beds.View";
			public const string Create = "Permissions.Beds.Create";
			public const string Delete = "Permissions.Beds.Delete";
			public const string EditStatus = "Permissions.Beds.EditStatus";
			public const string AssignPatient = "Permissions.Beds.AssignPatient";
			public const string Release = "Permissions.Beds.Release";
		}

		public static class Visits
		{
			public const string View = "Permissions.Visits.View";
			public const string Create = "Permissions.Visits.Create";
			public const string Edit = "Permissions.Visits.Edit";
			public const string Delete = "Permissions.Visits.Delete";
			public const string Admit = "Permissions.Visits.Admit";
			public const string Discharge = "Permissions.Visits.Discharge";
		}

		public static class Prescriptions
		{
			public const string View = "Permissions.Prescriptions.View";
			public const string Create = "Permissions.Prescriptions.Create";
			public const string Edit = "Permissions.Prescriptions.Edit";
			public const string Delete = "Permissions.Prescriptions.Delete";
			public const string ChangeStatus = "Permissions.Prescriptions.ChangeStatus";
		}

		public static class LabResults
		{
			public const string View = "Permissions.LabResults.View";
			public const string Create = "Permissions.LabResults.Create";
			public const string Edit = "Permissions.LabResults.Edit";
			public const string Delete = "Permissions.LabResults.Delete";
		}

		public static class DischargeSummaries
		{
			public const string View = "Permissions.DischargeSummaries.View";
			public const string Create = "Permissions.DischargeSummaries.Create";
			public const string Edit = "Permissions.DischargeSummaries.Edit";
			public const string Delete = "Permissions.DischargeSummaries.Delete";
			public const string DownloadPdf = "Permissions.DischargeSummaries.DownloadPdf";
		}

		public static class Messages
		{
			public const string View = "Permissions.Messages.View";
			public const string Send = "Permissions.Messages.Send";
			public const string MarkAsRead = "Permissions.Messages.MarkAsRead";
			public const string Delete = "Permissions.Messages.Delete";
		}

		public static class Notifications
		{
			public const string View = "Permissions.Notifications.View";
			public const string MarkAsRead = "Permissions.Notifications.MarkAsRead";
			public const string Delete = "Permissions.Notifications.Delete";
			public const string ManagePreferences = "Permissions.Notifications.ManagePreferences";
			public const string RunAppointmentReminders = "Permissions.Notifications.RunAppointmentReminders";
		}

		public static class AuditLogs
		{
			public const string View = "Permissions.AuditLogs.View";
		}

		public static class Dashboard
		{
			public const string ViewAdmin = "Permissions.Dashboard.ViewAdmin";
			public const string ViewDoctor = "Permissions.Dashboard.ViewDoctor";
			public const string ViewNurse = "Permissions.Dashboard.ViewNurse";
			public const string ViewPatient = "Permissions.Dashboard.ViewPatient";
		}

		public static class Analytics
		{
			public const string View = "Permissions.Analytics.View";
			public const string ViewAdmissions = "Permissions.Analytics.ViewAdmissions";
			public const string ViewBedOccupancy = "Permissions.Analytics.ViewBedOccupancy";
			public const string ViewAppointments = "Permissions.Analytics.ViewAppointments";
			public const string ViewPatientConditions = "Permissions.Analytics.ViewPatientConditions";
		}

		public static IEnumerable<string> All()
		{
			return typeof(Permissions)
				.GetNestedTypes()
				.SelectMany(type => type.GetFields(
					BindingFlags.Public |
					BindingFlags.Static |
					BindingFlags.FlattenHierarchy))
				.Where(field => field is { IsLiteral: true, IsInitOnly: false } &&
								field.FieldType == typeof(string))
				.Select(field => field.GetRawConstantValue()!.ToString()!);
		}

	}
}

