using HMS.Application.Wards.WardsDTOs;

namespace HMS.Application.Wards.Queries
{
    public record GetWardByIdQuery(Guid WardId) : IRequest<WardDto>;

    public class GetWardByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetWardByIdQuery, WardDto>
    {
        public async Task<WardDto> Handle(
            GetWardByIdQuery request, CancellationToken cancellationToken)
        {
            var ward = await db.Wards
                .Include(w => w.Rooms).ThenInclude(r => r.Beds).ThenInclude(b => b.Patient).ThenInclude(p => p.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(w => w.Id == request.WardId, cancellationToken)
                ?? throw new NotFoundException(nameof(Ward), request.WardId);

            return mapper.Map<WardDto>(ward);
        }
    }
}
