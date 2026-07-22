using HMS.Application.Analytics.DTOs;

namespace HMS.Application.Analytics.Queries
{
    public record GetBedOccupancyAnalyticsQuery : IRequest<BedOccupancyAnalyticsDto>;

    public class GetBedOccupancyAnalyticsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetBedOccupancyAnalyticsQuery, BedOccupancyAnalyticsDto>
    {
        public async Task<BedOccupancyAnalyticsDto> Handle(
            GetBedOccupancyAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var wards = await db.Wards
                .Include(w => w.Rooms).ThenInclude(r => r.Beds)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var allBeds = wards.SelectMany(w => w.Rooms).SelectMany(r => r.Beds).ToList();
            var total       = allBeds.Count;
            var occupied    = allBeds.Count(b => b.Status == BedStatus.Occupied);
            var available   = allBeds.Count(b => b.Status == BedStatus.Available);
            var maintenance = allBeds.Count(b => b.Status == BedStatus.Maintenance);

            var byWard = wards.Select(w =>
            {
                var wardBeds     = w.Rooms.SelectMany(r => r.Beds).ToList();
                var wardTotal    = wardBeds.Count;
                var wardOccupied = wardBeds.Count(b => b.Status == BedStatus.Occupied);
                return new WardOccupancyDto
                {
                    WardName      = w.Name,
                    TotalBeds     = wardTotal,
                    OccupiedBeds  = wardOccupied,
                    OccupancyRate = wardTotal > 0 ? Math.Round((double)wardOccupied / wardTotal * 100, 1) : 0
                };
            }).ToList();

            return new BedOccupancyAnalyticsDto
            {
                TotalBeds       = total,
                OccupiedBeds    = occupied,
                AvailableBeds   = available,
                MaintenanceBeds = maintenance,
                OccupancyRate   = total > 0 ? Math.Round((double)occupied / total * 100, 1) : 0,
                ByWard          = byWard
            };
        }
    }
}
