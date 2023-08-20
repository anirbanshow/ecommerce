import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from 'antd';

const CreateCategory = () => {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    // handle Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, { name });

            if (data?.success) {
                toast.success(`${name} is created successfully`);
                getAllCategory();
                setName("");
            } else {
                toast.error(data.name);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in input form");
        }
    }

    // get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);

            if (data?.success) {
                setCategories(data?.category);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting categories");
        }
    }

    useEffect(() => {
        getAllCategory();
    }, []);

    // update category
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
                { name: updatedName });

            if (data?.success) {
                toast.success(`${updatedName} is updated successfully`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCategory();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    // delete category
    const handledelete = async (id) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`);

            if (data?.success) {
                toast.success(`${updatedName} is deleted successfully`);
                getAllCategory();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Layout>
            <div className="container-fluid p-3">
                <div className="row">

                    <div className="col-md-3">
                        <AdminMenu />
                    </div>

                    <div className="col-md-9">
                        <h1>Manage Category</h1>

                        <div className='py-3 w-50'>
                            <CategoryForm
                                handleSubmit={handleSubmit}
                                value={name}
                                selValue={setName}
                            />
                        </div>

                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        categories?.map(c => (
                                            <tr key={c._id}>
                                                <td>{c.name}</td>
                                                <td>
                                                    <button
                                                        className='btn btn-primary'
                                                        onClick={() => {
                                                            setVisible(true);
                                                            setUpdatedName(c.name);
                                                            setSelected(c);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button type='button' className='btn btn-danger ms-2'
                                                        onClick={() => {
                                                            handledelete(c._id);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Modal title="Basic Modal" onCancel={() => setVisible(false)} visible={visible}>
                        <CategoryForm value={updatedName} selValue={setUpdatedName} handleSubmit={handleUpdate} />
                    </Modal>

                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory;