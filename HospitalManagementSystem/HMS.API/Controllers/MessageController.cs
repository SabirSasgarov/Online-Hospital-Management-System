using HMS.Application.Messages.Commands;
using HMS.Application.Messages.DTOs;
using HMS.Application.Messages.Queries;
using HMS.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class MessageController(ISender sender, ICurrentUserService currentUser) : BaseApiController
    {
        private Guid CurrentUserId => Guid.Parse(currentUser.UserId!);

        // GET /api/message?withUserId=&isRead=&page=1&pageSize=30
        [HttpGet]
        [HasPermission(Permissions.Messages.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? withUserId,
            [FromQuery] bool? isRead,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 30,
            CancellationToken ct = default)
        {
            var result = await sender.Send(
                new GetMessagesQuery(CurrentUserId, withUserId, isRead, page, pageSize), ct);
            return Ok(result);
        }

        // POST /api/message
        [HttpPost]
        [HasPermission(Permissions.Messages.Send)]
        public async Task<IActionResult> Send([FromBody] SendMessageDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new SendMessageCommand(CurrentUserId, dto), ct);
            return Ok(new { id });
        }

        // PATCH /api/message/{id}/read
        [HttpPatch("{id:guid}/read")]
        [HasPermission(Permissions.Messages.MarkAsRead)]
        public async Task<IActionResult> MarkAsRead(Guid id, CancellationToken ct)
        {
            await sender.Send(new MarkMessageAsReadCommand(id, CurrentUserId), ct);
            return NoContent();
        }

        // DELETE /api/message/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Messages.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteMessageCommand(id, CurrentUserId), ct);
            return NoContent();
        }
    }
}
