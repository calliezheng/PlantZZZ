import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import BackButton from './BackButton';

//Define the type for Typescript 
interface Product {
    id?: number;
    product_name: string;
    ProductType?: {
        id: number;
        type_name: string
      };
    product_type: string;
    picture: string;
    price: number;
    is_active: boolean
  }

  interface Product_Type{
    id: number;
    type_name: string
  }

  // Create Validation by yup
  const validationSchema = Yup.object().shape({
    product_name: Yup.string()
      .required('Product name is required'),
    product_type: Yup.number()
        .required('Product type name is required'),
    price: Yup.number()
      .integer('Price must be an integer')
      .positive('Price must be greater than zero')
      .required('Price is required'),
    
    picture: Yup.mixed()
      .required('A picture is required')
});

  
function ManageProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [types, setTypes] = useState<Product_Type[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [updatedFiles, setUpdatedFiles] = useState<{[key: number]: File | null }>({});
    const [currentType, setCurrentType] = useState<string>("Plant");
   
    // Fetch data
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get("http://localhost:3001/store/product/manage"); 
            console.log("Products fetched:", response.data);
            setProducts(response.data);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
    
        fetchProducts();
      }, []);
    
    useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/store/product/type"); 
        console.log("Types fetched:", response.data);
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching Types:', error);
      }
    };

    fetchTypes();
  }, []);

 // Filter product with different type to display on different pages
  const filteredProducts = currentType
  ? products.filter(p => p.ProductType?.type_name === currentType)
  : products;

  // Function to add or change pictures
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, productId?: number) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const file = event.currentTarget.files[0];
      console.log("File selected:", file); // Debugging statement
  
      if (productId) {
        setUpdatedFiles({ ...updatedFiles, [productId]: file });
      } else {
        setSelectedFile(file);
      }
    }
  };

  // Add product
  const handleAddProduct = async (values: Product, actions: FormikHelpers<Product>) => {
      const formData = new FormData();
      formData.append('product_name', values.product_name);
      formData.append('product_type', values.product_type);
      formData.append('price', values.price.toString());
      
      if (selectedFile) {
        formData.append('picture', selectedFile);
      }
      try {
        const response = await axios.post('http://localhost:3001/store/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          },
        });
        setProducts(currentProducts => [...currentProducts, response.data]);
        setIsAdding(false);
        setSelectedFile(null);
        alert('New product added successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error adding product:', error);
      }
      actions.setSubmitting(false);
    };
  
  // Inactive product
  const handleDeactiveProduct = async (id?: number) => {
    if (id) {
      try {
        const response = await axios.patch(`http://localhost:3001/store/product/deactivate/${id}`); 
        if(response.status === 204) {
          alert('Product deactive successfully');
          window.location.reload();
          setProducts(currentProduct => currentProduct.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deactivating product:', error);
      }
    }
};

// Active product
const handleActiveProduct = async (id?: number) => {
  if (id) {
    try {
      const response = await axios.patch(`http://localhost:3001/store/product/activate/${id}`); 
      if(response.status === 204) {
        alert('Product active successfully');
        window.location.reload();
        setProducts(currentProduct => currentProduct.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deactivating product:', error);
    }
  }
};

//Edit product
const handleUpdateProduct = async (values: Product, actions: FormikHelpers<Product>) => {
  // Check if there's an editing Product and if it has an ID
  if (!editingProduct || editingProduct.id === undefined) {
    console.error('Error updating Product: editingProduct is not defined or lacks an ID');
    return;
  }
  const formData = new FormData();
    formData.append('product_name', values.product_name);
    formData.append('product_type', values.product_type);
    formData.append('price', values.price.toString());
  
    if (selectedFile) {
      formData.append('picture', selectedFile);
      console.log("Appending selected file to FormData");
    }

    const updatedPicture = updatedFiles[editingProduct.id];
    if (updatedPicture) {
      formData.append('picture', updatedPicture);
    }

    try {
      // Send the update request with formData
      const response = await axios.put(`http://localhost:3001/store/product/edit/${editingProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the state to reflect the changes
      setProducts(currentProducts =>
        currentProducts.map(product => (product.id === editingProduct.id ? { ...product, ...response.data } : product))
    );
      
      // Reset editing Product and selected file
      setEditingProduct(null);
      alert('Product updated successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      // Stop the form submission process
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <button onClick={() => setIsAdding(true)} className="text-lg leading-6 font-medium font-poetsen text-beige bg-brown hover:bg-brown-dark focus:outline-none focus:ring-2 focus:ring-brown-dark focus:ring-opacity-50 rounded-lg shadow-lg transition duration-150 ease-in-out px-6 py-2 my-4">Add New Product</button>
      {/* Filter nav bar */}
      <div className="flex justify-left space-x-4">
        {types.map(type => (
          <button
            key={type.id}
            onClick={() => setCurrentType(type.type_name)}
            className={`text-lg font-poetsen text-brown px-4 py-2 rounded-lg shadow hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out mb-4 ${currentType === type.type_name ? 'font-bold bg-green-600' : 'bg-beige'}`}
          >
            {type.type_name}
          </button>
        ))}
      </div>

      {/* Add product form */}
      {isAdding && (
              <Formik
                  initialValues={{ product_name: '', product_type: '', price: 0, picture: '', is_active: true }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, actions) => { await handleAddProduct(values, actions);}}
              >
                  {({ isSubmitting, setFieldValue }) => (
                    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${isAdding ? '' : 'hidden'}`}>
                      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                          <h3 className="block text-4xl font-amatic font-medium text-green-700 text-center">Add New Product</h3>
                          <Form>
                            <div className="mt-2">
                              <label htmlFor="product_name" className="block text-lg text-left font-opensans font-medium text-green-700">Product Name</label>
                              <Field name="product_name" type="text" placeholder="Product Name" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                              <ErrorMessage name="product_name" component="div" className="error text-red-500 text-base italic"/>
                            </div>

                            <div className="mt-2">
                              <label htmlFor="product_type" className="block text-lg text-left font-opensans font-medium text-green-700">Product Type</label>    
                              <Field as="select" name="product_type" type="text" placeholder="Product Type" className="mt-1 p-2 w-full border rounded-md font-opensans">
                                  <option value="">Select a type</option>
                                  {types.map(type => (
                                      <option key={type.id} value={type.id}>{type.type_name}</option>
                                  ))}
                              <ErrorMessage name="product_type" component="div" className="error text-red-500 text-base italic"/>
                              </Field>
                            </div>

                            <div className="mt-2">
                              <label htmlFor="price" className="block text-lg text-left font-opensans font-medium text-green-700">Price</label>   
                              <Field name="price" type="number" placeholder="Price" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                              <ErrorMessage name="price" component="div" className="error text-red-500 text-base italic"/>
                            </div>

                            <div className="mt-2">
                              <label htmlFor="picture" className="block text-lg text-left font-opensans font-medium text-green-700">Picture</label>    
                                <input type="file" name="picture" onChange={(event) => {
                                    if (event.currentTarget.files && event.currentTarget.files.length > 0){
                                        handleFileChange(event, editingProduct?.id);
                                        setFieldValue("picture", event.currentTarget.files[0]);
                                    }
                                }} className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                                <ErrorMessage name="picture" component="div" className="error text-red-500 text-base italic"/>
                            </div>

                            <div className="items-center px-4 py-3">
                              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">Add Product</button>
                              <button type="button" onClick={() => setIsAdding(false)} disabled={isSubmitting} className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  )}
              </Formik>
          )}

        {/* Edit product form */}
        {editingProduct && (
          <Formik
            initialValues={{product_name: editingProduct.product_name, product_type: editingProduct.product_type, price: editingProduct.price, picture: '', is_active: true}}
            validationSchema={validationSchema}
            onSubmit={handleUpdateProduct}
          >
            {({ isSubmitting, setFieldValue }) => (
              <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${ editingProduct? '' : 'hidden'}`}>
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3 text-center">
                    <h3 className="block text-4xl font-amatic font-medium text-green-700 text-center">Edit Product</h3>
                    <Form>
                    <div className="mt-2">
                      <label htmlFor="product_name" className="block text-lg text-left font-opensans font-medium text-green-700">Product Name</label>
                      <Field name="product_name" type="text" placeholder="Product Name" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                      <ErrorMessage name="product_name" component="div" className="error text-red-500 text-base italic"/>
                    </div>

                    <div className="mt-2">
                      <label htmlFor="product_type" className="block text-lg text-left font-opensans font-medium text-green-700">Product Type</label>    
                      <Field as="select" name="product_type" type="text" placeholder="Product Type" className="mt-1 p-2 w-full border rounded-md font-opensans">
                          <option value="">Select a type</option>
                          {types.map(type => (
                              <option key={type.id} value={type.id}>{type.type_name}</option>
                          ))}
                      <ErrorMessage name="product_type" component="div" className="error text-red-500 text-base italic"/>
                      </Field>
                    </div>

                    <div className="mt-2">
                      <label htmlFor="price" className="block text-lg text-left font-opensans font-medium text-green-700">Picture</label> 
                      <Field name="price" type="number" placeholder="Price" className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                      <ErrorMessage name="price" component="div" className="error text-red-500 text-base italic"/>
                    </div>

                    <div className="mt-2">
                      <label htmlFor="picture" className="block text-lg text-left font-opensans font-medium text-green-700">Picture</label>   
                      <input type="file" name="picture" onChange={(event) => {
                                      if (event.currentTarget.files && event.currentTarget.files.length > 0){
                                          handleFileChange(event);
                                          setFieldValue("picture", event.currentTarget.files[0]);
                                      }
                                  }} className="mt-1 p-2 w-full border rounded-md font-opensans"/>
                      <ErrorMessage name="picture" component="div" className="error text-red-500 text-base italic"/>
                    </div>

                    <div className="items-center px-4 py-3">
                      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">Update Product</button>
                      <button type="button" onClick={() => setEditingProduct(null)} className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-opensans font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                    </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </Formik>
        )}

      {/* Existing products card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-beige">
            <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(product.picture)}`} alt={product.product_name} />
            <div className="px-6 py-4">
              <div className="font-bold font-opensans text-xl text-brown mb-2">Name: {product.product_name}</div>
              <div className="font-bold font-opensans text-xl text-brown mb-2">Price: {product.price}</div>
              <div className="font-bold font-opensans text-xl text-brown mb-2">
                {product.ProductType ? `Type: ${product.ProductType.type_name}` : ''}
              </div>
              <div className="font-bold font-opensans text-xl text-brown mb-2">Status: {product.is_active ? 'Active' : 'Inactive'}</div>
            
              <button onClick={() => setEditingProduct(product)} className="mr-4 font-poetsen text-green-600 text-lg">Edit</button>
              <button
                onClick={() => product.is_active ? handleDeactiveProduct(product.id) : handleActiveProduct(product.id)}
                className={`mr-4 font-poetsen text-lg ${product.is_active ? 'text-red-600' : 'text-green-600'}`}
              >
                {product.is_active ? 'Inactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProduct
