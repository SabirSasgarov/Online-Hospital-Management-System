using HMS.Domain.Entities;
using HMS.Domain.Enums;
using HMS.Persistence.Context;

namespace HMS.Persistence.Seeds
{
    /// <summary>
    /// Seeds Wards → Rooms → Beds in one pass.
    /// </summary>
    public static class WardSeeds
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var context = services.GetRequiredService<AppDbContext>();
            var logger = services.GetRequiredService<ILogger<AppDomain>>();

            try
            {
                if (context.Wards.Any()) return;

                // Each tuple: (wardName, wardType, floor, rooms[])
                // Each room: (roomNumber, roomType, beds[])
                // Each bed: bedNumber

                var wards = new List<Ward>
                {
                    new()
                    {
                        Name = "Cardiology Ward", Type = "Cardiology", Floor = 3,
                        CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                        Rooms =
                        [
                            new Room
                            {
                                RoomNumber = "301", Type = RoomType.Double,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "301A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "301B", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            },
                            new Room
                            {
                                RoomNumber = "302", Type = RoomType.Single,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "302A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            },
                            new Room
                            {
                                RoomNumber = "303", Type = RoomType.Double,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "303A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "303B", Status = BedStatus.Maintenance, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            }
                        ]
                    },

                    new()
                    {
                        Name = "General Ward A", Type = "General", Floor = 1,
                        CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                        Rooms =
                        [
                            new Room
                            {
                                RoomNumber = "101", Type = RoomType.General,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "101A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "101B", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "101C", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "101D", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            },
                            new Room
                            {
                                RoomNumber = "102", Type = RoomType.General,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "102A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "102B", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "102C", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "102D", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            }
                        ]
                    },

                    new()
                    {
                        Name = "ICU", Type = "Intensive Care", Floor = 2,
                        CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                        Rooms =
                        [
                            new Room
                            {
                                RoomNumber = "201", Type = RoomType.ICU,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "201A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "201B", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            },
                            new Room
                            {
                                RoomNumber = "202", Type = RoomType.ICU,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "202A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "202B", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            }
                        ]
                    },

                    new()
                    {
                        Name = "Pediatrics Ward", Type = "Pediatrics", Floor = 4,
                        CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                        Rooms =
                        [
                            new Room
                            {
                                RoomNumber = "401", Type = RoomType.Double,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "401A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "401B", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            },
                            new Room
                            {
                                RoomNumber = "402", Type = RoomType.Single,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "402A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            }
                        ]
                    },

                    new()
                    {
                        Name = "Neurology Ward", Type = "Neurology", Floor = 5,
                        CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                        Rooms =
                        [
                            new Room
                            {
                                RoomNumber = "501", Type = RoomType.Double,
                                CreatedBy = "system", CreatedAt = DateTime.UtcNow,
                                Beds =
                                [
                                    new Bed { BedNumber = "501A", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow },
                                    new Bed { BedNumber = "501B", Status = BedStatus.Available, CreatedBy = "system", CreatedAt = DateTime.UtcNow }
                                ]
                            }
                        ]
                    }
                };

                context.Wards.AddRange(wards);
                await context.SaveChangesAsync();
                logger.LogInformation("Wards, rooms and beds seeded.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error seeding wards.");
                throw;
            }
        }
    }
}
