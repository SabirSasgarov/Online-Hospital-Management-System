using AutoMapper;
using HMS.Application.Messages.DTOs;
using HMS.Application.Notifications.DTOs;

namespace HMS.Application.Common.Mappings
{
    public class MessageNotificationMappingProfile : Profile
    {
        public MessageNotificationMappingProfile()
        {
            CreateMap<Message, MessageDto>()
                .ForMember(d => d.SenderName,   o => o.MapFrom(s => s.Sender.FirstName   + " " + s.Sender.LastName))
                .ForMember(d => d.ReceiverName, o => o.MapFrom(s => s.Receiver.FirstName + " " + s.Receiver.LastName));

            CreateMap<Notification, NotificationDto>()
                .ForMember(d => d.Type, o => o.MapFrom(s => s.Type.ToString()));
        }
    }
}
