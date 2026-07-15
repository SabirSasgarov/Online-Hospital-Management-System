using HMS.API.Authorization;
using HMS.Application.Patients.Commands;
using HMS.Application.Patients.PatientsDTOs;
using HMS.Application.Patients.Queries;
using HMS.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class PatientController(ISender sender) : BaseApiController
    {
        // GET /api/patient?search=&condition=&page=1&pageSize=10
        [HttpGet]
        [HasPermission(Permissions.Patients.View)]
        public async Task<IActionResult> GetPatients(
            [FromQuery] string? search,
            [FromQuery] string? condition,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await sender.Send(new GetPatientsQuery(search, condition, page, pageSize));
            return Ok(result);
        }

        // GET /api/patient/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Patients.View)]
        public async Task<IActionResult> GetPatientById(Guid id)
        {
            var result = await sender.Send(new GetPatientByIdQuery(id));
            return Ok(result);
        }

        // GET /api/patient/{id}/medical-history
        [HttpGet("{id:guid}/medical-history")]
        [HasPermission(Permissions.Patients.ViewMedicalHistory)]
        public async Task<IActionResult> GetMedicalHistory(Guid id)
        {
            var result = await sender.Send(new GetPatientMedicalHistoryQuery(id));
            return Ok(result);
        }

        // POST /api/patient
        [HttpPost]
        [HasPermission(Permissions.Patients.Create)]
        public async Task<IActionResult> CreatePatient([FromBody] CreatePatientDto dto)
        {
            var id = await sender.Send(new CreatePatientCommand(dto));
            return CreatedAtAction(nameof(GetPatientById), new { id }, new { id });
        }

        // PUT /api/patient/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Patients.Edit)]
        public async Task<IActionResult> UpdatePatient(Guid id, [FromBody] UpdatePatientDto dto)
        {
            await sender.Send(new UpdatePatientCommand(id, dto));
            return NoContent();
        }

        // PUT /api/patient/{id}/medical-history
        [HttpPut("{id:guid}/medical-history")]
        [HasPermission(Permissions.Patients.ManageMedicalHistory)]
        public async Task<IActionResult> UpdateMedicalHistory(Guid id, [FromBody] UpdateMedicalHistoryDto dto)
        {
            await sender.Send(new UpdateMedicalHistoryCommand(id, dto));
            return NoContent();
        }

        // DELETE /api/patient/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Patients.Delete)]
        public async Task<IActionResult> DeletePatient(Guid id)
        {
            await sender.Send(new DeletePatientCommand(id));
            return NoContent();
        }
    }
}
