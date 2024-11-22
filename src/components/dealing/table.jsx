import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Edit2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

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
import { Checkbox } from "../ui/checkbox";
import OrderForm from "../forms/order/OrderForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Notification, toaster } from "rsuite";
import { axiosInstance } from "@/utils/axiosConfig";

export function DealingDataTable({ orders }) {
  const [openForm, setOpenForm] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const data = orders;

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (itemToDelete) {
      await deleteOrder(itemToDelete);
      setItemToDelete(null);
      setIsAlertOpen(false);
    }
  };

  const openDeleteAlert = (item) => {
    setItemToDelete(item);
    setIsAlertOpen(true);
  };

  const deleteOrder = async (order) => {
    const orderId = order._id;

    try {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL}/orders/admin/${orderId}`
      );
      toaster.push(
        <Notification header="Success" type="success">
          {response.data.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
    } catch (error) {
      toaster.push(
        <Notification header="Error" type="error">
          {response.data.error.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "uid",
      header: "ID",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date");
        const formatted = dayjs(date).format("DD-MM-YYYY");
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "user.name",
      id: "user.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      /*  cell: ({ row }) => {
        const name = row.getValue("name");
        const formatted = toCapitalize(name);
        return <div>{formatted}</div>;
      },*/
    },
    {
      accessorKey: "security",
      header: "Security",
      cell: ({ row }) => {
        const name = row.original.security?.name;
        return <div>{name}</div>;
      },
    },
    { accessorKey: "type", header: "Type" },

    {
      accessorKey: "amount",
      header: "Amount",
    },
    { accessorKey: "volume", header: "Volume" },

    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const volume = row.original.volume;
        const executed = row.original.executed;
        const balance = volume - executed;
        return <div>{balance}</div>;
      },
    },

    {
      header: "Status",
      cell: ({ row }) => {
        let stat = "mm";
        const volume = row.original.volume;
        const executed = row.original.executed;
        const balance = volume - executed;
        if (balance === volume) {
          stat = "pending";
        }
        if (balance < volume) {
          stat = "processing";
        }
        if (balance === 0) {
          stat = "completed";
        }

        return (
          <div
            className={`capitalize ${
              stat === "pending"
                ? "text-red-400"
                : stat === "processing"
                ? "text-blue-800"
                : "text-green-500"
            }`}
          >
            {stat}
          </div>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/orders/${order._id}`, {
                    state: {
                      orderId: order._id,
                    },
                  })
                }
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openDeleteAlert(row.original)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
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
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Search Client..."
          value={table.getColumn("user.name")?.getFilterValue() ?? ""}
          onChange={(event) => {
            table.getColumn("user.name")?.setFilterValue(event.target.value);
          }}
          className="w-[300px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={() => {}} className="bg-blue-950">
          Export
        </Button>
      </div>
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
      <OrderForm
        open={openForm}
        setOpen={setOpenForm}
        size={750}
        title="New Order"
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this customer?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete order
              with
              {itemToDelete?.volume} volume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Yes, delete order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
