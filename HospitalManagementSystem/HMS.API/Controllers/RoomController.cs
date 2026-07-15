using HMS.Application.Rooms.Commands;
using HMS.Application.Rooms.Queries;
using HMS.Application.Rooms.RoomsDTOs;

namespace HMS.API.Controllers
{
    [Authorize]
    public class RoomController(ISender sender) : BaseApiController
    {
        // GET /api/room?wardId=&search=&type=&page=1&pageSize=20
        [HttpGet]
        [HasPermission(Permissions.Rooms.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? wardId,
            [FromQuery] string? search,
            [FromQuery] RoomType? type,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetRoomsQuery(wardId, search, type, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/room/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Rooms.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetRoomByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/room
        [HttpPost]
        [HasPermission(Permissions.Rooms.Create)]
        public async Task<IActionResult> Create([FromBody] CreateRoomDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateRoomCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/room/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Rooms.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRoomDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateRoomCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/room/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Rooms.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteRoomCommand(id), ct);
            return NoContent();
        }
    }
}
