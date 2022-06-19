import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState("");
  const [errorDelete, setErrorDelete] = useState("");
  const [errorUpdate, setErrorUpdate] = useState("");
  const [edit, setEdit] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [successCreate, setSuccessCreate] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [name, setName] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateId, setUpdateId] = useState("");

  // const
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
    getCategories();
  }, [
    dispatch,
    userInfo,
    successDelete,
    successCreate,
    errorDelete,
    errorUpdate,
    error,
    errorCreate,
    successUpdate,
  ]);

  const deleteHandler = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    if (window.confirm("Are you sure")) {
      try {
        const { data } = await axios.delete(
          `http://localhost:5000/api/categories/${id}`,
          config
        );
        setLoadingDelete(false);
        setSuccessDelete(data);
      } catch (error) {
        setLoadingDelete(false);
        setErrorDelete(error.message);
      }
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/categories/`,
        { name },
        config
      );
      setLoadingCreate(false);
      setSuccessCreate(data);
    } catch (error) {
      setLoadingCreate(false);
      setErrorCreate(error.message);
    }
  };

  const updateCategory = async (e, product) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/categories/${product._id}`,
        { name: updateName },
        config
      );
      setEdit(false)
      setLoadingUpdate(false);
      setSuccessUpdate(data);
    } catch (error) {
      setLoadingUpdate(false);
      setErrorUpdate(error.message);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/categories");
      setLoading(false);
      setCategories(data);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-4 m-4">
      <Row className="align-items-center">
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className="text-right">
          <Form onSubmit={createCategory}>
            <Form.Group controlId="name">
              {/* <Form.Label>Name</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button className="my-3" type="submit">
              <i className="fas fa-plus"></i> Create Category
            </Button>
          </Form>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingUpdate && <Loader />}
      {loadingCreate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>
                    {product.name}
                    {edit && updateId === product._id && (
                      <Form onSubmit={(e) => updateCategory(e, product)}>
                        <Form.Group controlId="name">
                          <Form.Control
                            type="text"
                            placeholder="Enter Category Name"
                            value={updateName}
                            onChange={(e) => setUpdateName(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button className="my-3" type="submit">
                          Update Category
                        </Button>
                      </Form>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-sm"
                      onClick={() => {
                        setEdit(true);
                        setUpdateName(product.name);
                        setUpdateId(product._id);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default CategoriesScreen;
