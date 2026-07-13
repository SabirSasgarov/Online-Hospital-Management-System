using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(m => m.Id);

            // Restrict on both sides to avoid multiple cascade path errors
            builder.HasOne(m => m.Sender)
                   .WithMany()
                   .HasForeignKey(m => m.SenderId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(m => m.Receiver)
                   .WithMany()
                   .HasForeignKey(m => m.ReceiverId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(m => m.Content).IsRequired().HasMaxLength(2000);

            // Inbox query: "give me all unread messages for this user"
            builder.HasIndex(m => new { m.ReceiverId, m.IsRead });

            // Conversation thread query: "give me all messages between user A and user B"
            builder.HasIndex(m => new { m.SenderId, m.ReceiverId });
        }
    }
}
