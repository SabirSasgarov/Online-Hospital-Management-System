using HMS.Application.Patients.PatientsDTOs;
using HMS.Domain.Constants;
using HMS.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
	[Authorize(Roles = Roles.Patient)]
	public class PatientController(UserManager<AppUser> userManager) : BaseApiController
	{
		[HttpGet("patients/{id}")]
		public async Task<IActionResult> GetPatientById(string id)
		{
			var user = await userManager.FindByIdAsync(id);
			if(user == null) 
				return NotFound(new { Message = "Patient not found" });
			
			return Ok(new
			{
				UserId = user.Id.ToString(),
				Email = user.Email ?? string.Empty,
				FullName = $"{user.FirstName} {user.LastName}",
				Roles = await userManager.GetRolesAsync(user)
			});
		}
		[HttpPost("patients")]
		public async Task<IActionResult> CreatePatient([FromBody] CreatePatientDto dto)
		{
			var user = await userManager.FindByEmailAsync(dto.Email);
			if(user != null)
				return BadRequest(new { Message = "Patient already exists" });

			user = new AppUser()
			{
				UserName = dto.Email,
				Email = dto.Email,
				FirstName = dto.FirstName,
				LastName = dto.LastName,
				EmailConfirmed = true
			};

			await userManager.CreateAsync(user, dto.Password);

			return Created("", new { Message = "Patient created successfully" });
		}

	}
}
