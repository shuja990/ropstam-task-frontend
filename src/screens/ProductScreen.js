import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { deleteProduct, listProductDetails } from "../actions/carActions";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCT_DELETE_RESET } from "../constants/productConstants";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const deleteHandler = () => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(product._id));
    }
  };

  const params = useParams();
  useEffect(() => {
    if (!product._id || product._id !== params.id) {
      dispatch(listProductDetails(params.id));
    }
    if(successDelete){
      dispatch({type:PRODUCT_DELETE_RESET})
      navigate("/")
    }
  }, [dispatch, params,successDelete]);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading || loadingDelete ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : errorDelete ? (
        <Message variant="danger">{errorDelete}</Message>
      ) : (
        <div className="m-4 p-4">
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Make: {product.make}</ListGroup.Item>
                <ListGroup.Item>Model: {product.model}</ListGroup.Item>
                <ListGroup.Item>
                  Registration Number: {product.regNo}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Category:</Col>
                      <Col>
                        <strong>{product.category}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Added By:</Col>
                      <Col>{product.addedBy?.name}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    {product.addedBy?._id === userInfo._id && (
                      <>
                        {" "}
                        <Button
                          onClick={() =>
                            navigate(`/product/edit/${product._id}`)
                          }
                          className="btn-block"
                          type="button"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={deleteHandler}
                          className="btn-block btn-danger"
                          type="button"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default ProductScreen;
