import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

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

  const handleUpdateProduct = async (values: Product, actions: FormikHelpers<Product>) => {
    // Check if there's an editing Product and if it has an ID
    if (!editingProduct || editingProduct.id === undefined) {
      console.error('Error updating Product: editingProduct is not defined or lacks an ID');
      return;
    }
  
    // Prepare FormData for multipart/form-data request
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

    const handleDeleteProduct = async (id?: number) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
          try {
              const response = await axios.delete(`http://localhost:3001/store/product/delete/${id}`);
              if (response.status === 200) {
                  alert('Product deleted successfully');
                  setProducts(products.filter(product => product.id !== id));
              }
          } catch (error) {
              console.error('Error deleting product:', error);
              alert('Failed to delete product');
          }
      }
  };

  return (
    <div className="container mx-auto p-4">
        {isAdding && (
                <Formik
                    initialValues={{
                        product_name: '',
                        product_type: '',
                        price: 0,
                        picture: '',
                        is_active: true
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, actions) => {
                        await handleAddProduct(values, actions);
                    }}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <Field name="product_name" type="text" placeholder="Product Name" />
                            <ErrorMessage name="product_name" component="div" />
                            
                            <Field as="select" name="product_type" type="text" placeholder="Product Type">
                                <option value="">Select a type</option>
                                {types.map(type => (
                                    <option key={type.id} value={type.id}>{type.type_name}</option>
                                ))}
                            <ErrorMessage name="product_type" component="div" />
                            </Field>

                            <Field name="price" type="number" placeholder="Price" />
                            <ErrorMessage name="price" component="div" />
                            
                            <input type="file" name="picture" onChange={(event) => {
                                if (event.currentTarget.files && event.currentTarget.files.length > 0){
                                    handleFileChange(event, editingProduct?.id);
                                    setFieldValue("picture", event.currentTarget.files[0]);
                                }
                            }} />
                            <ErrorMessage name="picture" component="div" />

                            <button type="submit" disabled={isSubmitting}>Add Plant</button>
                            <button
                              type="button"
                              onClick={() => setIsAdding(false)} 
                              disabled={isSubmitting}
                            >Cancel</button>
                        </Form>
                    )}
                </Formik>
            )}

            <button onClick={() => setIsAdding(true)}>Add New Product</button>

        {editingProduct && (
          <Formik
              initialValues={{
                product_name: '',
                product_type: '',
                price: 0,
                picture: '',
                is_active: true
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdateProduct}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <Field name="product_name" type="text" placeholder="Product Name" />
                <ErrorMessage name="product_name" component="div" />
                
                <Field as="select" name="product_type" type="text" placeholder="Product Type">
                    <option value="">Select a type</option>
                    {types.map(type => (
                        <option key={type.id} value={type.id}>{type.type_name}</option>
                    ))}
                <ErrorMessage name="product_type" component="div" />
                </Field>

                <Field name="price" type="number" placeholder="Price" />
                <ErrorMessage name="price" component="div" />
                
                <input type="file" name="picture" onChange={(event) => {
                                if (event.currentTarget.files && event.currentTarget.files.length > 0){
                                    handleFileChange(event);
                                    setFieldValue("picture", event.currentTarget.files[0]);
                                }
                            }} />
                <ErrorMessage name="picture" component="div" />
                <button type="submit" disabled={isSubmitting}>Update Product</button>
                <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
              </Form>
            )}
          </Formik>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(product.picture)}`} alt={product.product_name} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Name: {product.product_name}</div>
              <div className="font-bold text-xl mb-2">Price: {product.price}</div>
              <div className="font-bold text-xl mb-2">
                {product.ProductType ? `Type: ${product.ProductType.type_name}` : ''}
              </div>
              <div className="font-bold text-xl mb-2">Status: {product.is_active ? 'Active' : 'Inactive'}</div>
            </div>
              <button onClick={() => setEditingProduct(product)} className="mr-2">Edit</button>
              <button
                onClick={() => product.is_active ? handleDeactiveProduct(product.id) : handleActiveProduct(product.id)}
                className="mr-2"
            >
                {product.is_active ? 'Deactivate' : 'Activate'}
            </button>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageProduct
