import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/carActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import { useParams,useNavigate } from "react-router-dom";

const ProductEditScreen = () => {
    const params = useParams()
    const navigate = useNavigate()
  const productId = params.id;

  const [name, setName] = useState("");
  const [category, setCategory] = useState(0);
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [regNo, setRegNo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [cloading, setCLoading] = useState(true);
  const [cError, setCError] = useState("");

  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        getCategories()
        setName(product.name);
        setMake(product.make);
        setImage(product.image)
        setModel(product.model);
        setRegNo(product.regNo);
        setCategory(product.category);
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate]);

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

      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        make,
        image,
        model,
        category,
        regNo,
        addedBy:product.addedBy._id,
      })
    );
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
  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Car</h1>

        {loading || cloading || loadingUpdate ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : cError ? (
          <Message variant="danger">{cError}</Message>
        ) : errorUpdate ? (
          <Message variant="danger">{errorUpdate}</Message>
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category </option>

                {!cloading &&
                  categories?.map((e) => (
                    <option value={e.name}>{e.name}</option>
                  ))}
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

export default ProductEditScreen;
