import { useData } from "@/context/userContext";
import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import axios from "axios";
import { DateRangePicker, Modal } from "rsuite";

const ActionLinks = ({ customerId }) => {
  const { statements } = useData();
  const [date, setDate] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  const handlePrint = async () => {
    const { from, to } = date;

    await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/statements/admin/${customerId}?from=${from}&to=${to}`
    );
    setIsOpen(false);
    // Here you can perform the print action with the selected date range

    console.log("Printing", "for date range:", from, to);
  };

  return (
    <>
      <div className="flex flex-col gap-3 bg-white p-2">
        <Button>Migrate Shares</Button>
        <Button className="bg-red-500">Send Activation Email</Button>
        <Button>Attach Docs</Button>
        <Button onClick={() => setIsOpen(true)}>Print Statement</Button>
      </div>

      <Modal
        backdrop="static"
        keyboard={false}
        open={isOpen}
        onClose={() => {}}
      >
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Hello</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {}} appearance="primary">
            Ok
          </Button>
          <Button onClick={() => {}} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Select Date Range for Statement</AlertDialogTitle>
            <AlertDialogDescription>
              Choose the start and end date for your statement print.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <DateRangePicker defaultOpen={true} className="z-50" />
          {/* <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            showTimePicker
            numberOfMonths={2}
            className="rounded-md border"
          /> */}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePrint}
              disabled={!date?.from || !date?.to}
            >
              Print
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionLinks;
