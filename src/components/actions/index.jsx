import { useData } from "@/context/userContext";
import { Button } from "@/components/ui/button";

import { useState } from "react";

import { Modal } from "rsuite";
import { axiosInstance } from "@/utils/axiosConfig";
import { ErrorMessage, Field, Form, Formik } from "formik";

const ActionLinks = ({ customerId }) => {
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  let globalBalance = 0;

  const handleSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.get(
        `/transactions/admin/${customerId}?from=${values.from}&to=${values.to}`
      );
      setTransactions(response.data);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const statements = transactions?.map((transaction) => {
    const credit = transaction.credit;
    const debit = transaction.debit;

    // Update the global balance
    globalBalance += credit - debit;

    // Add the balance to the transaction
    return {
      ...transaction,
      balance: globalBalance,
    };
  });

  console.log({ statements });

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
        onClose={() => setIsOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>Date Range</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="w-full flex flex-col">
            <p>Select range of dates you want to get statement</p>
            <Formik
              initialValues={{ from: null, to: null }}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form>
                  <div className="w-full flex gap-4 mt-4 bg-gray-300 p-3 rounded">
                    <div className="w-full flex flex-col">
                      <label htmlFor="from">From</label>
                      <Field
                        name="from"
                        type="datetime-local"
                        value={values.from}
                        className="rounded p-2"
                      />
                      <ErrorMessage name="from" component={"div"} />
                    </div>
                    <div className="w-full flex flex-col">
                      <label htmlFor="to">To</label>
                      <Field
                        name="to"
                        value={values.to}
                        type="datetime-local"
                        className="rounded p-2"
                      />
                      <ErrorMessage name="to" component={"div"} />
                    </div>
                  </div>
                  <Button type="subbmit">Ok</Button>
                </Form>
              )}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionLinks;
