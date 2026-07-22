using HMS.Application.Announcements.AnnouncementsDTOs;

namespace HMS.Application.Common.Mappings
{
    public class AnnouncementMappingProfile : Profile
    {
        public AnnouncementMappingProfile()
        {
            CreateMap<Announcement, AnnouncementDto>()
                .ForMember(d => d.Author, o => o.MapFrom(s => s.CreatedBy));

            CreateMap<CreateAnnouncementDto, Announcement>(MemberList.None);
            CreateMap<UpdateAnnouncementDto, Announcement>(MemberList.None);
        }
    }
}
