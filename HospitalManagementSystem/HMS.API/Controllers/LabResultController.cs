using HMS.Application.LabResults.Commands;
using HMS.Application.LabResults.DTOs;
using HMS.Application.LabResults.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class LabResultController(ISender sender) : BaseApiController
    {
        // GET /api/labresult?visitId=&patientId=&status=&page=1&pageSize=20
        [HttpGet]
        [HasPermission(Permissions.LabResults.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? visitId,
            [FromQuery] Guid? patientId,
            [FromQuery] LabResultStatus? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetLabResultsQuery(visitId, patientId, status, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/labresult/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.LabResults.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetLabResultByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/labresult
        [HttpPost]
        [HasPermission(Permissions.LabResults.Create)]
        public async Task<IActionResult> Create([FromBody] CreateLabResultDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateLabResultCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/labresult/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.LabResults.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLabResultDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateLabResultCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/labresult/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.LabResults.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteLabResultCommand(id), ct);
            return NoContent();
        }
    }
}
