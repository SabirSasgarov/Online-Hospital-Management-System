using HMS.Application.Rooms.RoomsDTOs;

namespace HMS.Application.Rooms.Queries
{
    public record GetRoomByIdQuery(Guid RoomId) : IRequest<RoomDto>;

    public class GetRoomByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetRoomByIdQuery, RoomDto>
    {
        public async Task<RoomDto> Handle(
            GetRoomByIdQuery request, CancellationToken cancellationToken)
        {
            var room = await db.Rooms
                .Include(r => r.Ward)
                .Include(r => r.Beds).ThenInclude(b => b.Patient).ThenInclude(p => p!.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == request.RoomId, cancellationToken)
                ?? throw new NotFoundException(nameof(Room), request.RoomId);

            return mapper.Map<RoomDto>(room);
        }
    }
}
