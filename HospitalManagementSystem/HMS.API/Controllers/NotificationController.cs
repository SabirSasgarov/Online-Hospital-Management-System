using HMS.Application.Notifications.Commands;
using HMS.Application.Notifications.DTOs;
using HMS.Application.Notifications.Queries;
using HMS.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class NotificationController(ISender sender, ICurrentUserService currentUser) : BaseApiController
    {
        private Guid CurrentUserId => Guid.Parse(currentUser.UserId!);

        // GET /api/notification?isRead=&type=&page=1&pageSize=30
        [HttpGet]
        [HasPermission(Permissions.Notifications.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] bool? isRead,
            [FromQuery] NotificationType? type,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 30,
            CancellationToken ct = default)
        {
            var result = await sender.Send(
                new GetNotificationsQuery(CurrentUserId, isRead, type, page, pageSize), ct);
            return Ok(result);
        }

        // PATCH /api/notification/{id}/read
        [HttpPatch("{id:guid}/read")]
        [HasPermission(Permissions.Notifications.MarkAsRead)]
        public async Task<IActionResult> MarkAsRead(Guid id, CancellationToken ct)
        {
            await sender.Send(new MarkNotificationAsReadCommand(id, CurrentUserId), ct);
            return NoContent();
        }

        // PATCH /api/notification/read-all
        [HttpPatch("read-all")]
        [HasPermission(Permissions.Notifications.MarkAsRead)]
        public async Task<IActionResult> MarkAllAsRead(CancellationToken ct)
        {
            await sender.Send(new MarkAllNotificationsAsReadCommand(CurrentUserId), ct);
            return NoContent();
        }

        // DELETE /api/notification/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Notifications.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteNotificationCommand(id, CurrentUserId), ct);
            return NoContent();
        }
    }
}
