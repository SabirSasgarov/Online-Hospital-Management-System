using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HMS.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class mig_3_added_some_permissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PrescriptionMedication_Prescriptions_PrescriptionId",
                table: "PrescriptionMedication");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PrescriptionMedication",
                table: "PrescriptionMedication");

            migrationBuilder.RenameTable(
                name: "PrescriptionMedication",
                newName: "PrescriptionMedications");

            migrationBuilder.RenameIndex(
                name: "IX_PrescriptionMedication_PrescriptionId",
                table: "PrescriptionMedications",
                newName: "IX_PrescriptionMedications_PrescriptionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PrescriptionMedications",
                table: "PrescriptionMedications",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PrescriptionMedications_Prescriptions_PrescriptionId",
                table: "PrescriptionMedications",
                column: "PrescriptionId",
                principalTable: "Prescriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PrescriptionMedications_Prescriptions_PrescriptionId",
                table: "PrescriptionMedications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PrescriptionMedications",
                table: "PrescriptionMedications");

            migrationBuilder.RenameTable(
                name: "PrescriptionMedications",
                newName: "PrescriptionMedication");

            migrationBuilder.RenameIndex(
                name: "IX_PrescriptionMedications_PrescriptionId",
                table: "PrescriptionMedication",
                newName: "IX_PrescriptionMedication_PrescriptionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PrescriptionMedication",
                table: "PrescriptionMedication",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PrescriptionMedication_Prescriptions_PrescriptionId",
                table: "PrescriptionMedication",
                column: "PrescriptionId",
                principalTable: "Prescriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
