using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class BedConfiguration : IEntityTypeConfiguration<Bed>
    {
        public void Configure(EntityTypeBuilder<Bed> builder)
        {
            builder.HasKey(b => b.Id);

            builder.HasOne(b => b.Room)
                   .WithMany(r => r.Beds)
                   .HasForeignKey(b => b.RoomId)
                   .OnDelete(DeleteBehavior.Cascade); // deleting a room removes its beds

            // Nullable patient assignment
            builder.HasOne(b => b.Patient)
                   .WithMany(p => p.OccupiedBeds)
                   .HasForeignKey(b => b.PatientId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.SetNull); // discharging/deleting patient frees the bed

            builder.Property(b => b.BedNumber).IsRequired().HasMaxLength(10);

            builder.Property(b => b.Status)
                   .HasConversion<string>()
                   .HasMaxLength(20);

            // Bed numbers must be unique within a room
            builder.HasIndex(b => new { b.RoomId, b.BedNumber }).IsUnique();

            builder.HasQueryFilter(b => !b.IsDeleted);
        }
    }
}
