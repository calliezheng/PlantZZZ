import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface Product {
    id?: number;
    product_name: string;
    ProductType: {
        id?: number;
        type_name: string
      };
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
    ProductType: Yup.object({
        type_name: Yup.string()
          .required('Product type name is required')
    }),
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

      const handleAddPlant = async (values: Product, actions: FormikHelpers<Product>) => {
        const formData = new FormData();
        formData.append('product_name', values.product_name);
        formData.append('ProductType.type_name', values.ProductType.type_name);
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
          alert('New Product added successfully');
          window.location.reload();
        } catch (error) {
          console.error('Error adding product:', error);
        }
        actions.setSubmitting(false);
      };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

  return (
    <div className="container mx-auto p-4">
        {isAdding && (
                <Formik
                    initialValues={{
                        product_name: '',
                        ProductType: { type_name: '' },
                        price: 0,
                        picture: '',
                        is_active: true
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, actions) => {
                        await handleAddPlant(values, actions);
                    }}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <Field name="product_name" type="text" placeholder="Product Name" />
                            <ErrorMessage name="product_name" component="div" />
                            
                            <Field as="select" name="ProductType.type_name" type="text" placeholder="Product Type">
                                <option value="">Select a type</option>
                                {types.map(type => (
                                    <option key={type.id} value={type.id}>{type.type_name}</option>
                                ))}
                            <ErrorMessage name="ProductType.type_name" component="div" />
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

                            <button type="submit" disabled={isSubmitting}>Submit</button>
                        </Form>
                    )}
                </Formik>
            )}

            <button onClick={() => setIsAdding(true)}>Add New Product</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full h-48 object-cover" src={`http://localhost:3001/images/products/${encodeURIComponent(product.picture)}`} alt={product.product_name} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Name: {product.product_name}</div>
              <div className="font-bold text-xl mb-2">Price: {product.price}</div>
              <div className="font-bold text-xl mb-2">Type: {product.ProductType.type_name}</div>
              <div className="font-bold text-xl mb-2">Status: {product.is_active ? 'Active' : 'Inactive'}</div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageProduct
