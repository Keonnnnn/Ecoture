using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecoture.Migrations
{
    /// <inheritdoc />
    public partial class AddIsCustomerReplyToResponse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isCustomerReply",
                table: "Responses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3631), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3632) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3636), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3636) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3639), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3640) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3642), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3643) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isCustomerReply",
                table: "Responses");

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9133), new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9134) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9137), new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9137) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9140), new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9141) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9143), new DateTime(2026, 6, 6, 17, 5, 34, 977, DateTimeKind.Utc).AddTicks(9144) });
        }
    }
}
