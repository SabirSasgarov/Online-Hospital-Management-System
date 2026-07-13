using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(EntityTypeBuilder<AuditLog> builder)
        {
            builder.HasKey(a => a.Id);

            // No FK to AppUser — stored as plain strings so logs are never lost when users are deleted
            builder.Property(a => a.UserId).IsRequired().HasMaxLength(50);
            builder.Property(a => a.UserName).IsRequired().HasMaxLength(100);
            builder.Property(a => a.UserRole).IsRequired().HasMaxLength(20);
            builder.Property(a => a.Action).IsRequired().HasMaxLength(20);
            builder.Property(a => a.Resource).IsRequired().HasMaxLength(100);
            builder.Property(a => a.ResourceId).IsRequired().HasMaxLength(50);
            builder.Property(a => a.IpAddress).HasMaxLength(50);

            // Admin filtering: "show logs for this resource" / "show logs in this time range"
            builder.HasIndex(a => a.Timestamp);
            builder.HasIndex(a => new { a.Resource, a.ResourceId });
            builder.HasIndex(a => a.UserId);

            // Audit logs are append-only — no soft delete, no query filter
        }
    }
}
