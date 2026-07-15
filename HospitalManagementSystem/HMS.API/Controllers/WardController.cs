using HMS.Application.Wards.Commands;
using HMS.Application.Wards.Queries;
using HMS.Application.Wards.WardsDTOs;

namespace HMS.API.Controllers
{
    [Authorize]
    public class WardController(ISender sender) : BaseApiController
    {
        // GET /api/ward?search=&page=1&pageSize=20
        [HttpGet]
        [HasPermission(Permissions.Wards.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetWardsQuery(search, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/ward/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Wards.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetWardByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/ward
        [HttpPost]
        [HasPermission(Permissions.Wards.Create)]
        public async Task<IActionResult> Create([FromBody] CreateWardDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateWardCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/ward/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Wards.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWardDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateWardCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/ward/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Wards.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteWardCommand(id), ct);
            return NoContent();
        }
    }
}
