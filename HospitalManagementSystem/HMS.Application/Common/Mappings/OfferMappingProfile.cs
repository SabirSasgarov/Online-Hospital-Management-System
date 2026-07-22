using HMS.Application.Offers.OffersDTOs;

namespace HMS.Application.Common.Mappings
{
    public class OfferMappingProfile : Profile
    {
        public OfferMappingProfile()
        {
            CreateMap<Offer, OfferDto>();

            CreateMap<CreateOfferDto, Offer>(MemberList.None);
            CreateMap<UpdateOfferDto, Offer>(MemberList.None);
        }
    }
}
