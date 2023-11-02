import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import Message from "../../components/Message";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  // console.log(`c.l from product list screen ${pageNumber}`);
  const {
    data,
    isLoading: loadingProducts,
    error: errorProducts,
    refetch,
  } = useGetProductsQuery({ pageNumber });

  const [createProduct] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const createProductHandler = async () => {
    try {
      await createProduct();
      refetch();
      toast.success("Product created successfully");
    } catch (err) {
      // console.log(err);
    }
  };
  const deleteProductHandler = async (productId) => {
    if (window.confirm("Are your sure?")) {
      try {
        await deleteProduct(productId);
        refetch();
        toast.success("Product deleted successfully");
      } catch (err) {
        // console.log(err);
      }
    }
  };

  return (
    <>
      <h1>Products</h1>
      <Col className="text-end">
        <Button className="btn-sm m-3" onClick={createProductHandler}>
          <FaEdit /> Create Product
        </Button>
      </Col>
      {loadingDelete && <Loader />}
      {loadingProducts ? (
        <Loader />
      ) : errorProducts ? (
        <Message variant="danger">
          {errorProducts?.data?.message || errorProducts.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products &&
              data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm me-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <Paginate pages={data?.pages} page={data?.page} isAdmin={true} />
    </>
  );
};

export default ProductListScreen;
