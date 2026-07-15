using HMS.Application.Beds.BedsDTOs;

namespace HMS.Application.Beds.Queries
{
    public record GetBedByIdQuery(Guid BedId) : IRequest<BedDto>;

    public class GetBedByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetBedByIdQuery, BedDto>
    {
        public async Task<BedDto> Handle(
            GetBedByIdQuery request, CancellationToken cancellationToken)
        {
            var bed = await db.Beds
                .Include(b => b.Room).ThenInclude(r => r.Ward)
                .Include(b => b.Patient).ThenInclude(p => p!.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken)
                ?? throw new NotFoundException(nameof(Bed), request.BedId);

            return mapper.Map<BedDto>(bed);
        }
    }
}
