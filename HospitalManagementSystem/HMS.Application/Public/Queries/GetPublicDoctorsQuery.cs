namespace HMS.Application.Public.Queries
{
    public record GetPublicDoctorsQuery(
        int Page = 1,
        int PageSize = 12
    ) : IRequest<PaginatedResult<PublicDoctorDto>>;

    public class GetPublicDoctorsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetPublicDoctorsQuery, PaginatedResult<PublicDoctorDto>>
    {
        public async Task<PaginatedResult<PublicDoctorDto>> Handle(
            GetPublicDoctorsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Doctors.AsNoTracking().Where(d => d.User.IsActive);

            var total = await query.CountAsync(cancellationToken);
            var doctors = await query
                .OrderBy(d => d.User.FirstName).ThenBy(d => d.User.LastName)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(d => new PublicDoctorDto
                {
                    Id = d.Id,
                    FullName = d.User.FirstName + " " + d.User.LastName,
                    Specialization = d.Specialization,
                    ProfileImageUrl = d.User.ProfileImageUrl,
                    IsAvailable = d.IsAvailable,
                })
                .ToListAsync(cancellationToken);

            return new PaginatedResult<PublicDoctorDto>
            {
                Items      = doctors,
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
