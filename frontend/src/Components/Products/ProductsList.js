import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import { Cookie } from '../Cookie';
import { Axios } from '../Axios';
import FullScreenLoader from '../FullScreenLoader/FullScreenLoader';
import Notification from '../Notification/Notification';

const cookie = new Cookie();
const axios = new Axios();

export default function ProductsList() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [expandedFilters, setExpandedFilters] = useState({
        categories: false,
        sorting: false
    });
    const [manufacturers, setManufacturers] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        manufacturers: [],
        sort: ''
    });
    const [sortingFilters] = useState(['Price: Low to High', 'Price: High to Low']);
    const [notification, setNotification] = useState(null);

    const fetchProducts = async () => {
        var pageSizeURI = pageSize + 9;
    
        axios.get(`Products/get-all-products/${offset}/${pageSizeURI}`).then((response) => {
            if (response.data.length <= pageSize) {
                setHasMoreProducts(false);
            }
            setPageSize(pageSizeURI);
            setOffset(pageSizeURI);
            setProducts((prev) => {
                const newProducts = response.data.filter((product) => 
                    !prev.some((existingProduct) => existingProduct.id === product.id)
                );
                return [...prev, ...newProducts];
            });
            setLoading(false);
        }).catch((error) => {
            setNotification({ message: "There was an error fetching the products.", status: 'error' });
            setLoading(false);
        });
    };
    

    const fetchManufacturers = async () => {
        axios.get('Products/get-all-manufacturers').then((response) => {
            if (response.status === 200){
                setManufacturers(response.data);
            }
        }).catch((error) => {
            setNotification({ message: "There was an error fetching the manufacturers", status: 'error' });
        });
    };

    useEffect(() => {
        if (!cookie.getCookie('access_token')) {
            window.location.href = '/';
        }

        if (selectedFilters.manufacturers.length === 0 && selectedFilters.sort === '') {
            fetchProducts();
            fetchManufacturers();
        } else {
            handleFilterProducts();
        }
    }, [selectedFilters]);

    const toggleFilter = (filterType) => {
        setExpandedFilters((prevState) => ({
            ...prevState,
            [filterType]: !prevState[filterType],
        }));
    };

    const handleFilterProducts = () => {
        if (hasMoreProducts) setHasMoreProducts(false);

        axios.post('Products/filtered-products', selectedFilters).then((response) => {
            if (response.status === 200){
                setProducts(response.data);
            }
        })
    };

    return (
        <div className="flex gap-4 pl-1">
            {notification && (
                <Notification 
                    message={notification.message} 
                    status={notification.status} 
                    onClose={() => setNotification(null)} 
                />
            )}
            <div className="w-1/5 bg-gray-100 p-4 rounded-md overflow-y-auto max-h-[65vh]">
            <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setSelectedFilters({ manufacturers: [], sort: '' })} className={`${selectedFilters.manufacturers.length === 0 && selectedFilters.sort === '' ? 'pointer-events-none opacity-50' : 'underline'} ml-3 mt-4 mb-4 text-sm text-gray-700 hover:text-gray-900`} >
                    Clear filter
                </button>
            <div className="space-y-4">
                <div>
                        <h4
                            className="text-sm font-semibold cursor-pointer"
                            onClick={() => toggleFilter('sorting')}
                        >
                            Sorting
                        </h4>
                        {expandedFilters.sorting && (
                            <ul className="pl-4 mt-2 space-y-2">
                                {sortingFilters.map((filter, _i) => (
                                    <li key={_i} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={filter}
                                            name="sorting"
                                            checked={selectedFilters.sort.includes(filter)}
                                            onChange={() => setSelectedFilters((prev) => ({...prev, sort: filter })) }
                                            className="mr-2"
                                        />
                                        <label htmlFor={filter} className="text-sm text-gray-700 hover:text-gray-900">
                                            {filter}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h4
                            className="text-sm font-semibold cursor-pointer"
                            onClick={() => toggleFilter('categories')}
                        >
                            Categories
                        </h4>
                        {expandedFilters.categories && (
                            <ul className="pl-4 mt-2 space-y-2">
                                {manufacturers.map((filter, _i) => (
                                    <li key={_i} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={filter}
                                            checked={selectedFilters.manufacturers.includes(filter)}
                                            onChange={() =>
                                                setSelectedFilters((prev) => ({
                                                    ...prev,
                                                    manufacturers: prev.manufacturers.includes(filter)
                                                        ? prev.manufacturers.filter((m) => m !== filter)
                                                        : [...prev.manufacturers, filter]
                                                }))
                                            }                                            
                                            className="mr-2"
                                        />
                                        <label htmlFor={filter} className="text-sm text-gray-700 hover:text-gray-900">
                                            {filter}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center w-[80%]">
                <div className="overflow-y-auto flex flex-wrap justify-center gap-4 h-[65vh] w-full">
                    {products.length > 0 ? (
                        products.map((product, _i) => (
                            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2 flex justify-around" key={_i}>
                                <Card 
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    quantity={product.quantity}
                                    manufacturer={product.manufacturer}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}

                    <div className="mb-4 w-full flex justify-center">
                        <button 
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 ${hasMoreProducts ? '' : 'hidden'}`}
                            onClick={() => {
                                fetchProducts();
                            }}
                        >
                            Load more
                        </button>
                    </div>
                </div>
            </div>

            <FullScreenLoader loading={loading} />
        </div>
    );
}
