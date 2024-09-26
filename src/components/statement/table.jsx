import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navigate, useNavigate } from "react-router";
import { toCapitalize } from "@/utils/sentenseCase";
import dayjs from "dayjs";
import ReceiptForm from "../forms/receipt/ReceiptForm";
import { Checkbox } from "../ui/checkbox";

export function StatementDataTable({ statements }) {
  const [openForm, setOpenForm] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const data = statements;

  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("transactionDate");
        const formatted = dayjs(date).format("DD-MM-YYYY");
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "action",
      header: "Type",
    },
    {
      accessorKey: "description",
      header: "Particulars",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "price",
      header: "Price (TZS)",
      cell: ({ row }) => {
        const price = row.original.price;
        const formmater = Intl.NumberFormat("sw-TZ", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        return <div className="capitalize">{formmater.format(price)}</div>;
      },
    },
    {
      accessorKey: "debit",
      header: "Debit (TZS)",
      cell: ({ row }) => {
        const debit = row.original.debit;
        const formmater = Intl.NumberFormat("sw-TZ", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        return <div className="capitalize">{formmater.format(debit)}</div>;
      },
    },
    {
      accessorKey: "credit",
      header: "Credit (TZS)",
      cell: ({ row }) => {
        const credit = row.original.credit;
        const formmater = Intl.NumberFormat("sw-TZ", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        return <div className="capitalize">{formmater.format(credit)}</div>;
      },
    },
    {
      accessorKey: "balance",
      header: "Balance (TZS)",
      cell: ({ row }) => {
        const amount = row.original.balance;
        const formmater = Intl.NumberFormat("sw-TZ", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        return <div className="capitalize">{formmater.format(amount)}</div>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full p-4 bg-white rounded shadow-sm">
      <div className="flex items-center py-4 gap-4">Statement</div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
