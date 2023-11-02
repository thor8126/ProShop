import { Col, Row } from "react-bootstrap";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarosel from "../components/ProductCarosel";
import Meta from "../components/Meta";
const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  // console.log(`c.l from home screen ${pageNumber} ${keyword}`);
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarosel />
      ) : (
        <Link to="/" className="btn btn-light">
          {" "}
          Go Back{" "}
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || "Error. Try Refreshing"}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Latest products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
