using HMS.Application.Wards.WardsDTOs;
using HMS.Application.Rooms.RoomsDTOs;
using HMS.Application.Beds.BedsDTOs;

namespace HMS.Application.Common.Mappings
{
    public class WardRoomBedMappingProfile : Profile
    {
        public WardRoomBedMappingProfile()
        {
            // ── Ward ─────────────────────────────────────────────────────────
            CreateMap<Room, RoomSummaryInWardDto>()
                .ForMember(d => d.Type,         o => o.MapFrom(s => s.Type.ToString()))
                .ForMember(d => d.TotalBeds,    o => o.MapFrom(s => s.Beds.Count))
                .ForMember(d => d.OccupiedBeds, o => o.MapFrom(s => s.Beds.Count(b => b.Status == BedStatus.Occupied)));

            CreateMap<Ward, WardSummaryDto>()
                .ForMember(d => d.TotalRooms,   o => o.MapFrom(s => s.Rooms.Count))
                .ForMember(d => d.TotalBeds,    o => o.MapFrom(s => s.Rooms.SelectMany(r => r.Beds).Count()))
                .ForMember(d => d.OccupiedBeds, o => o.MapFrom(s => s.Rooms.SelectMany(r => r.Beds).Count(b => b.Status == BedStatus.Occupied)));

            CreateMap<Ward, WardDto>()
                .IncludeBase<Ward, WardSummaryDto>()
                .ForMember(d => d.Rooms, o => o.MapFrom(s => s.Rooms));

            CreateMap<CreateWardDto, Ward>(MemberList.None);
            CreateMap<UpdateWardDto, Ward>(MemberList.None);

            // ── Room ─────────────────────────────────────────────────────────
            CreateMap<Bed, BedInRoomDto>()
                .ForMember(d => d.Status,      o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.PatientName, o => o.MapFrom(s =>
                    s.Patient != null ? s.Patient.User.FirstName + " " + s.Patient.User.LastName : null));

            CreateMap<Room, RoomSummaryDto>()
                .ForMember(d => d.WardName,     o => o.MapFrom(s => s.Ward.Name))
                .ForMember(d => d.Type,         o => o.MapFrom(s => s.Type.ToString()))
                .ForMember(d => d.TotalBeds,    o => o.MapFrom(s => s.Beds.Count))
                .ForMember(d => d.OccupiedBeds, o => o.MapFrom(s => s.Beds.Count(b => b.Status == BedStatus.Occupied)));

            CreateMap<Room, RoomDto>()
                .IncludeBase<Room, RoomSummaryDto>()
                .ForMember(d => d.Beds, o => o.MapFrom(s => s.Beds));

            CreateMap<CreateRoomDto, Room>(MemberList.None);
            CreateMap<UpdateRoomDto, Room>(MemberList.None);

            // ── Bed ──────────────────────────────────────────────────────────
            CreateMap<Bed, BedDto>()
                .ForMember(d => d.RoomNumber, o => o.MapFrom(s => s.Room.RoomNumber))
                .ForMember(d => d.WardId,     o => o.MapFrom(s => s.Room.WardId))
                .ForMember(d => d.WardName,   o => o.MapFrom(s => s.Room.Ward.Name))
                .ForMember(d => d.Status,     o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.PatientName, o => o.MapFrom(s =>
                    s.Patient != null ? s.Patient.User.FirstName + " " + s.Patient.User.LastName : null));

            CreateMap<CreateBedDto, Bed>(MemberList.None);
        }
    }
}
