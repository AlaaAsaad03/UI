import React, { useState, useContext } from 'react';
import './ExploreMenu.css';
import { StoreContext } from '../context/StoreContext';

const ExploreMenu = ({ setCategory, setSubcategory, setFoodList, setLoadingCategory   }) => {
    const { categories, fetchSubcategories, fetchItemsBySubcategory } = useContext(StoreContext);
    const [subcategories, setSubcategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubcategory, setActiveSubcategory] = useState(null);

    const handleCategorySelect = async (category) => {
        setLoadingCategory(true); 
        if (activeCategory === category.name) {
            setCategory("All");
            setSubcategory(null);
            setActiveCategory(null);
            setSubcategories([]);
            setFoodList([]); 
        } else {
            setCategory(category.name);
            setSubcategory(null);
            setActiveCategory(category.name);
            const fetchedSubcategories = await fetchSubcategories(category._id);
            setSubcategories(fetchedSubcategories);
            setFoodList([]); 
        }
        setLoadingCategory(false); 
    };

    const handleSubcategorySelect = async (subcategory) => {
        setLoadingCategory(true);
        setSubcategory(subcategory.name);
        setActiveSubcategory(subcategory._id); 
        const items = await fetchItemsBySubcategory(subcategory._id);
        setFoodList(items);
        setLoadingCategory(false);
    };

    return (
        <div className="explore-menu" id="explore-menu">
           <div className="title">
        <p>Join the Relief Effort</p>
        <h2>Deliver Hope with Every Pack</h2>
      </div>

            <div className="explore-menu-list">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                        <div
                            key={category._id}
                            onClick={() => handleCategorySelect(category)}
                            className={`explore-menu-list-item ${activeCategory === category.name ? 'active' : ''}`}
                        >
                            <div className="category-card">
                                <img
                                    src={`http://localhost:4000/uploads/${category.image}`}
                                    alt={category.name}
                                    className="category-imagee"
                                />
                                <p className="category-name">{category.name}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No categories available</p>
                )}
            </div>

            <hr />

            {subcategories.length > 0 && (
                <div className="subcategories">
                   {subcategories.map((subcategory) => (
                    <div
                        key={subcategory._id}
                        onClick={() => handleSubcategorySelect(subcategory)}
                        className={`subcategory-item ${activeSubcategory === subcategory._id ? 'active-subcategory' : ''}`}
                    >
                        <p>{subcategory.name}</p>
                    </div>
                ))}

                </div>
            )}
        </div>
    );
};

export default ExploreMenu;