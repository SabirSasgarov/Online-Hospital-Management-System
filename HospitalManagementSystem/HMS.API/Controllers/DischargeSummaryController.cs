using HMS.Application.DischargeSummaries.Commands;
using HMS.Application.DischargeSummaries.DTOs;
using HMS.Application.DischargeSummaries.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class DischargeSummaryController(ISender sender) : BaseApiController
    {
        // GET /api/dischargesummary?patientId=&doctorId=&page=1&pageSize=20
        [HttpGet]
        [HasPermission(Permissions.DischargeSummaries.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? patientId,
            [FromQuery] Guid? doctorId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetDischargeSummariesQuery(patientId, doctorId, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/dischargesummary/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.DischargeSummaries.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetDischargeSummaryByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/dischargesummary
        [HttpPost]
        [HasPermission(Permissions.DischargeSummaries.Create)]
        public async Task<IActionResult> Create([FromBody] CreateDischargeSummaryDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateDischargeSummaryCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/dischargesummary/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.DischargeSummaries.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDischargeSummaryDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateDischargeSummaryCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/dischargesummary/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.DischargeSummaries.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteDischargeSummaryCommand(id), ct);
            return NoContent();
        }
    }
}
