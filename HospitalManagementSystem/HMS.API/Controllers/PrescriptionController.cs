using HMS.Application.Prescriptions.Commands;
using HMS.Application.Prescriptions.DTOs;
using HMS.Application.Prescriptions.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class PrescriptionController(ISender sender) : BaseApiController
    {
        // GET /api/prescription?visitId=&patientId=&doctorId=&status=&page=1&pageSize=20
        [HttpGet]
        [HasPermission(Permissions.Prescriptions.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? visitId,
            [FromQuery] Guid? patientId,
            [FromQuery] Guid? doctorId,
            [FromQuery] PrescriptionStatus? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(
                new GetPrescriptionsQuery(visitId, patientId, doctorId, status, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/prescription/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Prescriptions.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetPrescriptionByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/prescription
        [HttpPost]
        [HasPermission(Permissions.Prescriptions.Create)]
        public async Task<IActionResult> Create([FromBody] CreatePrescriptionDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreatePrescriptionCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/prescription/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Prescriptions.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePrescriptionDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdatePrescriptionCommand(id, dto), ct);
            return NoContent();
        }

        // PATCH /api/prescription/{id}/status
        [HttpPatch("{id:guid}/status")]
        [HasPermission(Permissions.Prescriptions.ChangeStatus)]
        public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] ChangePrescriptionStatusDto dto, CancellationToken ct)
        {
            await sender.Send(new ChangePrescriptionStatusCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/prescription/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Prescriptions.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeletePrescriptionCommand(id), ct);
            return NoContent();
        }
    }
}
