using HMS.API.Authorization;
using HMS.Application.Doctors.Commands;
using HMS.Application.Doctors.DoctorsDTOs;
using HMS.Application.Doctors.Queries;
using HMS.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class DoctorController(ISender sender) : BaseApiController
    {
        // GET /api/doctor?search=&specialization=&isAvailable=&page=1&pageSize=10
        [HttpGet]
        [HasPermission(Permissions.Doctors.View)]
        public async Task<IActionResult> GetDoctors(
            [FromQuery] string? search,
            [FromQuery] string? specialization,
            [FromQuery] bool? isAvailable,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await sender.Send(new GetDoctorsQuery(search, specialization, isAvailable, page, pageSize));
            return Ok(result);
        }

        // GET /api/doctor/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Doctors.View)]
        public async Task<IActionResult> GetDoctorById(Guid id)
        {
            var result = await sender.Send(new GetDoctorByIdQuery(id));
            return Ok(result);
        }

        // GET /api/doctor/{id}/schedule
        [HttpGet("{id:guid}/schedule")]
        [HasPermission(Permissions.Doctors.ViewAvailability)]
        public async Task<IActionResult> GetSchedule(Guid id)
        {
            var result = await sender.Send(new GetDoctorScheduleQuery(id));
            return Ok(result);
        }

        // POST /api/doctor
        [HttpPost]
        [HasPermission(Permissions.Doctors.Create)]
        public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto dto)
        {
            var id = await sender.Send(new CreateDoctorCommand(dto));
            return CreatedAtAction(nameof(GetDoctorById), new { id }, new { id });
        }

        // PUT /api/doctor/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Doctors.Edit)]
        public async Task<IActionResult> UpdateDoctor(Guid id, [FromBody] UpdateDoctorDto dto)
        {
            await sender.Send(new UpdateDoctorCommand(id, dto));
            return NoContent();
        }

        // PUT /api/doctor/{id}/schedule
        [HttpPut("{id:guid}/schedule")]
        [HasPermission(Permissions.Doctors.ManageSchedule)]
        public async Task<IActionResult> UpdateSchedule(Guid id, [FromBody] UpdateDoctorScheduleDto dto)
        {
            await sender.Send(new UpdateDoctorScheduleCommand(id, dto));
            return NoContent();
        }

        // PATCH /api/doctor/{id}/availability
        [HttpPatch("{id:guid}/availability")]
        [HasPermission(Permissions.Doctors.ManageAvailability)]
        public async Task<IActionResult> UpdateAvailability(Guid id, [FromBody] UpdateDoctorAvailabilityDto dto)
        {
            await sender.Send(new ToggleDoctorAvailabilityCommand(id, dto));
            return NoContent();
        }

        // DELETE /api/doctor/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Doctors.Delete)]
        public async Task<IActionResult> DeleteDoctor(Guid id)
        {
            await sender.Send(new DeleteDoctorCommand(id));
            return NoContent();
        }
    }
}
