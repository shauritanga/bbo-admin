import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useNavigate } from "react-router";
import { useData } from "@/context/userContext";

import { Modal } from "rsuite";
import { axiosInstance } from "@/utils/axiosConfig";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dayjs from "dayjs";

const ActionLinks = ({ customerId, statements }) => {
  //const [transactions, setTransactions] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const startDate = new Date(values.from);
    const endDate = new Date(values.to);
    const filteredStatements = filterStatementsByDateRange(
      statements,
      startDate,
      endDate
    );
    console.log({ filteredStatements });
    handleOpenNewTabWithData(filteredStatements);
    setIsOpen(false);
  };

  const handleOpenNewTabWithData = (state) => {
    const data = state;
    localStorage.setItem("statements", JSON.stringify(data));
    window.open(`${window.location.origin}/statement`, "_blank");
  };

  const filterStatementsByDateRange = (statements, startDate, endDate) => {
    console.log({ statements });
    return statements.filter((statement) => {
      const transactionDate = dayjs(statement.transactionDate);
      return (
        transactionDate.isAfter(dayjs(startDate).subtract(1, "day")) &&
        transactionDate.isBefore(dayjs(endDate).add(1, "day"))
      );
    });
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
