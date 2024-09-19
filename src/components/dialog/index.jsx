import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";

export function DialogDemo() {
  const [transactionDate, settransactionDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [payee, setPayee] = useState(null);
  const [clients, setClients] = useState([]);
  const [category, setCategory] = useState(null);
  const [realAccount, setRealAccount] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const fetchPayees = () => {
      fetch(`${import.meta.env.VITE_BASE_URL}/customers`, {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setClients(data))
        .catch((error) => console.log(error));
    };
    fetchPayees();
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const [paymentMethodResponse, clientResponse, accountResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BASE_URL}/paymethods`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/customers`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/accounts`),
          ]);

        setClients(clientResponse.data);
        setPaymentMethod(paymentMethodResponse.data);
        setRealAccount(accountResponse.data);
      } catch (error) {}
    };

    fetchPaymentMethods();
  }, []);

  //   if (!paymentMethod) {
  //     return;
  //   }
  if (!clients) {
    return;
  }
  console.log(realAccount);
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/receipts`,
        values
      );
      setSubmitting(false);
      await toaster.push(
        <Notification header="Success" type="success">
          {response.data.message}
        </Notification>,
        {
          duration: 4000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        {
          duration: 4000,
          placement: "topCenter",
        }
      );
    }
  };
  return (
    <Dialog className="w-full">
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Receipt</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Formik
            initialValues={{
              date: "",
              amount: "",
              reference: "",
              category: "receipt",
              client_id: "",
              account_id: "",
              payment_method_id: "",
              status: "new",
              description: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <div className="flex gap-5 items-center">
                  <div className="flex flex-col">
                    <label htmlFor="transaction-date">Transaction Date</label>
                    <Field
                      type="date"
                      placeholder="dd-mm-yyyy"
                      id="transaction-date"
                      name="date"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="amount">Amount</label>
                    <Field
                      type="text"
                      placeholder="Amount"
                      id="amount"
                      name="amount"
                    />
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="category">Category</label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Buy">Buy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="real-account">Real Account</label>

                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {realAccount.map((payee) => (
                          <SelectItem key={payee._id} value={payee._id}>
                            {payee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="payee">Payee</label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients?.map((payee) => (
                          <SelectItem key={payee._id} value={payee._id}>
                            {payee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="receipt-modal-form-control">
                    <label htmlFor="pay-method">Payement Method</label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <div className="receipt-modal-form-control">
                    <label htmlFor="reference">Reference</label>
                    <Field type="text" id="reference" name="reference" />
                  </div>
                </div>
                <div>
                  <div className="receipt-modal-form-control">
                    <label htmlFor="Description">Description</label>
                    <Field type="text" as="textarea" name="description">
                      Description
                    </Field>
                  </div>
                </div>
                <div className="row">
                  <Button type="submit" appearance="primary">
                    Ok
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
