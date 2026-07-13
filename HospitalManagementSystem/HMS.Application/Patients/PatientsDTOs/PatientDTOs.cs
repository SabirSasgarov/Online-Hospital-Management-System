using System.ComponentModel.DataAnnotations;

namespace HMS.Application.Patients.PatientsDTOs
{
	public class CreatePatientDto
	{
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string UserName { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}

}
