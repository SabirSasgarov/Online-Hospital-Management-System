namespace HMS.Persistence.Configurations
{
    public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
    {
        public void Configure(EntityTypeBuilder<Announcement> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Title).IsRequired().HasMaxLength(200);
            builder.Property(a => a.Summary).IsRequired().HasMaxLength(500);
            builder.Property(a => a.Content).IsRequired();
            builder.Property(a => a.ImageUrl).HasMaxLength(1000);

            builder.HasIndex(a => new { a.IsPublished, a.PublishedAt });

            builder.HasQueryFilter(a => !a.IsDeleted);
        }
    }
}
