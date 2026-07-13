using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(n => n.Id);

            builder.HasOne(n => n.User)
                   .WithMany()
                   .HasForeignKey(n => n.UserId)
                   .OnDelete(DeleteBehavior.Cascade); // deleting a user clears their notifications

            builder.Property(n => n.Title).IsRequired().HasMaxLength(200);
            builder.Property(n => n.Content).IsRequired().HasMaxLength(1000);

            builder.Property(n => n.Type)
                   .HasConversion<string>()
                   .HasMaxLength(50);

            // "Give me all unread notifications for this user, newest first"
            builder.HasIndex(n => new { n.UserId, n.IsRead, n.CreatedAt });
        }
    }
}
