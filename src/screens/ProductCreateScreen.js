import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../actions/carActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { useNavigate } from "react-router-dom";
const ProductCreateScreen = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(0);
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [regNo, setRegNo] = useState("");
  const [cloading, setCLoading] = useState(true);
  const [cError, setCError] = useState("");

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    getCategories()
    if (success) {
      navigate("/");
    }
    dispatch({
      type: PRODUCT_CREATE_RESET,
    });
  }, [dispatch, navigate, success]);
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        config
      );

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };
  const getCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/categories");
      setCLoading(false);
      setCategories(data);
    } catch (error) {
      setCLoading(false);

      setCError(error.Message);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        name,
        image,
        make,
        model,
        regNo,
        category,
        addedBy: userInfo._id,
      })
    );
  };

  return (
    <>
      <Link to="/rentposts" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Car</h1>

        {loading || cloading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : cError ? (
          <Message variant="danger">{cError}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                required
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="make">
              <Form.Label>Make</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Make"
                value={make}
                required
                onChange={(e) => setMake(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="model">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Thumbnail Image</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                id="image-file"
                label="Choose File"
                custom
                type="file"
                onChange={uploadFileHandler}
              ></Form.Control>

              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Registration Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Registration Number"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3 mt-4">
              <Form.Label htmlFor="">Category</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category </option>

                {!cloading &&
                    categories?.map(e=>(
                        <option value={e.name}>{e.name}</option>
                    ))
                }
              </Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
