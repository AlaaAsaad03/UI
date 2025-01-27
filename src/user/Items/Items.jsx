import React, { useState } from 'react';
import ExploreMenu from '../ExploreMenu/ExploreMenu';
import FoodDisplay from '../FoodDisplay/FoodDisplay';
import './Items.css'; 
import HeroSection from '../HeroSection/HeroSection';
import GeneralLoader from '../../components/GeneralLoader/GeneralLoader';

const ItemsPage = () => {
    const [category, setCategory] = useState("All");
    const [subcategory, setSubcategory] = useState(null);
    const [foodList, setFoodList] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [loadingCategory, setLoadingCategory] = useState(false);  // Loader state for categories
    const [loadingFoodList, setLoadingFoodList] = useState(false);  // Loader state for food items

    
    return (
        
        <div className="items-page">
           
            <HeroSection/>
            {/* {loading ? (
                <GeneralLoader message="Hold tight... your donation journey is about to begin!" />
            ) : (
                <> */}
             <ExploreMenu 
                setCategory={setCategory} 
                setSubcategory={setSubcategory} 
                setFoodList={setFoodList} 
                setLoadingCategory={setLoadingCategory}
            />   
            {loadingCategory ? (
                <GeneralLoader message="Loading Items..." />
            ) : (
             <FoodDisplay 
                category={category} 
                food_list={foodList} 
                searchQuery={searchQuery} // Pass searchQuery
                setSearchQuery={setSearchQuery} // Pass setSearchQuery
                
            />    
            )} 
            </div>
    );
};

export default ItemsPage;