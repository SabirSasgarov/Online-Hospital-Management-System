using HMS.Application.Offers.OffersDTOs;

namespace HMS.Application.Offers.Commands
{
    public record CreateOfferCommand(CreateOfferDto Dto) : IRequest<Guid>;

    public class CreateOfferCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateOfferCommand, Guid>
    {
        public async Task<Guid> Handle(CreateOfferCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Dto.Title))
                throw new ValidationException(new Dictionary<string, string[]> { ["Title"] = ["Title is required."] });

            var offer = mapper.Map<Offer>(request.Dto);

            db.Offers.Add(offer);
            await db.SaveChangesAsync(cancellationToken);
            return offer.Id;
        }
    }
}
