namespace HMS.Persistence.Configurations
{
    public class WardConfiguration : IEntityTypeConfiguration<Ward>
    {
        public void Configure(EntityTypeBuilder<Ward> builder)
        {
            builder.HasKey(w => w.Id);

            builder.Property(w => w.Name).IsRequired().HasMaxLength(100);
            builder.Property(w => w.Type).IsRequired().HasMaxLength(50);

            // TotalBeds and OccupiedBeds are computed from navigation properties — never stored
            builder.Ignore(w => w.TotalBeds);
            builder.Ignore(w => w.OccupiedBeds);

            builder.HasQueryFilter(w => !w.IsDeleted);
        }
    }
}
