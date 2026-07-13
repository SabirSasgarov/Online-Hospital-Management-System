using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.HasKey(r => r.Id);

            builder.HasOne(r => r.Ward)
                   .WithMany(w => w.Rooms)
                   .HasForeignKey(r => r.WardId)
                   .OnDelete(DeleteBehavior.Cascade); // deleting a ward removes its rooms

            builder.Property(r => r.RoomNumber).IsRequired().HasMaxLength(10);

            builder.Property(r => r.Type)
                   .HasConversion<string>()
                   .HasMaxLength(20);

            // Room numbers must be unique within a ward
            builder.HasIndex(r => new { r.WardId, r.RoomNumber }).IsUnique();

            builder.HasQueryFilter(r => !r.IsDeleted);
        }
    }
}
