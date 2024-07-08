import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import styled from "styled-components";
import CreateCategoryForm from "../../components/forms/category/CreateCategoryForm";
import { fetchCategories, setSearch } from "../../reducers/categorySlice";
import { useDispatch, useSelector } from "react-redux";

const Category = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const { categories, status, error, filters } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error: {error}</div>;
  }

  const filteredCategories = categories.filter((category) => {
    if (filters.search) {
      return category.manager?.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    }
    return true;
  });

  return (
    <Wrapper>
      <TableWrapper>
        <Actions>
          <TextInput
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Saerch"
          />
          <Button onClick={() => setOpenCreateForm(true)}>Add Category</Button>
        </Actions>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Category</TableHeader>
              <TableHeader>Manager</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Default</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category._id}>
                <TableData>{category.name}</TableData>
                <TableData>{category.manager?.name}</TableData>
                <TableData>{category.description}</TableData>
                <TableData>
                  {category.default === "yes" ? "Yes" : "No"}
                </TableData>
                <TableData>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <CiTrash color="red" style={{ cursor: "pointer" }} />
                  </div>
                </TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
      <CreateCategoryForm open={openCreateForm} setOpen={setOpenCreateForm} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Actions = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
`;
const TableWrapper = styled.div`
  background-color: #fff;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const TableHead = styled.thead`
  background-color: #f2f2f2;
`;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;
const TableData = styled.td`
  padding: 8px;
  text-align: left;
`;
const TableHeader = styled.th`
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
`;

const TextInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  width: 300px;
  font-size: 16px;
  outline: none;
`;
const Button = styled.button`
  padding: 6px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

export default Category;
